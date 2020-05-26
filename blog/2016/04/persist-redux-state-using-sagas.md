---
title: Persist Redux State by using Sagas
date: '2016-04-26'
tags:
  - React
  - Redux
notes: Originally posted on [InVisionApp's Engineering blog](https://engineering.invisionapp.com/post/persist-redux-state-by-using-sagas/)
---

[redux-saga](https://redux-saga.js.org/) is a fairly new library in the [Redux](https://redux.js.org/) ecosystem, one that has quickly gained adoption and traction in the community. We’ve started using sagas to manage image uploads and to implement a history mechanism (undo/redo). We really liked the way it helps orchestrate complex flows that have side-effects, by using [ES6 generators](https://davidwalsh.name/es6-generators), which promote more readable asynchronous code and simpler unit tests.

Our app already persisted the state by loading it from the server on page navigation and by saving it periodically, after some specific actions were triggered. It relied on the [redux-storage](https://github.com/michaelcontento/redux-storage) library, a simple _plug and play_ library for loading/storing data, but we started having more complex requirements on the persistence mechanism. That prompted us to replace redux-storage with a custom saga and liked the result so much that decided to share it with you.

This article assumes that you have some `redux` and `redux-saga` knowledge, but I’ve aimed for the explanations to be gradual and simple, so newcomers to these libraries can learn from them. The documentation for [Redux](https://redux.js.org/) and [redux-sagas](https://redux-saga.js.org/) are great starting points and a good reference if you have questions throughout this article.

### Scope

The persistence mechanism described in this article assumes that you’ll save the whole state to the server (although you can easily select just a subset of it). The save operation follows these requirements:

- There must be a whitelist of actions (only actions on the whitelist will trigger a save)
- Some actions (such as dragging an image) should be debounced, in order to only trigger a save operation to the server after an amount of time
- Other actions (such as creating an image) should save immediately
- There should be an “unsaved changes” indicator on the UI, that is displayed when a change is first recorded and hidden when a successful save response is received from the server

This article does not explain how to setup sagas or a react/redux project (as there’s already the documentation and countless examples). It does provide a github repository with a complete example for you to check how it was setup and how it plays together with React/Redux: https://github.com/jportela/redux-saga-persistence

### Starting Small

Let’s start by implementing a simple saga that, on all actions, triggers a save immediately to the server:

```js
import { call, put, select, take } from 'redux-saga/effects'
import { serverSave } from '../actions'
import * as PersistenceEngine from './persistence/engine'

export default function* persistenceSaga() {
  while (true) {
    const action = yield take()
    const state = yield select()
    yield put(serverSave.request(action))
    yield call(PersistenceEngine.save, state, action)
    yield put(serverSave.success())
  }
}
```

By wrapping the generator body in a `while(true)`, it will be run for all actions, looping through the following instructions:

1. Retrieve any action (the `take` effect intercepts actions dispatched to the store)
2. Get the state from the redux store (the `select` effect does that)
3. dispatch a `serverSave.request` action (the `put` effect dispatches an action to the redux store)
4. call the `PersistenceEngine.save` function, which is a promise that does a server request, fulfilled when the server responds
5. dispatch a `serverSave.success` action

The `serverSave` actions indicate the app that a request is being made and when it’s fulfilled (it’s your choice to use it or not, depending if you want to show any indication on the UI). One obvious improvement we can make is to add error handling, which `redux-saga` makes it as easy as synchronous code, by using the familiar `try/catch`:

```js
import { call, put, select, take } from 'redux-saga/effects'
import { serverSave } from '../actions'
import * as PersistenceEngine from './persistence/engine'

export default function* persistenceSaga() {
  while (true) {
    const action = yield take()
    const state = yield select()
    yield put(serverSave.request(action))
    try {
      yield call(PersistenceEngine.save, state, action)
      yield put(serverSave.success())
    } catch (e) {
      yield put(serverSave.failure())
    }
  }
}
```

That was simple and easy, but it’s hardly a good solution. All actions are triggering a save, so your server will be mindlessly bombarded with save requests. To help prevent this, we’ll implement a simple whitelist, so only specific actions will trigger a save.

### Implementing a Whitelist

This whitelist just uses an Object as a map, to check if the action type exists on the whitelist. If it doesn’t exist, it will just `continue` the loop, not saving anything. I recommend separating the Whitelist into its own module, as it will quickly grow.

```js
// persistence/whitelist.js
import * as types from '../../constants/ActionTypes'

const Whitelist = {
  [types.CREATE_IMAGE]: true,
  [types.MOVE_IMAGE]: true,
}

export default Whitelist
```

```js
import { call, put, select, take } from 'redux-saga/effects'
import { serverSave } from '../actions'
import * as PersistenceEngine from './persistence/engine'
import Whitelist from './persistence/whitelist'

export default function* persistenceSaga() {
  while (true) {
    const action = yield take()

    if (!Whitelist[action.type]) {
      continue
    }

    const state = yield select()

    yield put(serverSave.request(action))
    try {
      yield call(PersistenceEngine.save, state, action)
      yield put(serverSave.success())
    } catch (e) {
      yield put(serverSave.failure())
    }
  }
}
```

Remember the requirements that we had? Let’s implement debouncing, as we don’t want that `MOVE_IMAGE` action to bomb our server with requests on every mouse move event.

### Implementing Debounce

We’ll start by implementing a delay promise (copied from redux-saga docs), that, by using generators, will look almost like a `sleep` function (with the advantage of not actually blocking the UI, it will just block the generator execution). The idea is to `yield` that “sleep” promise so the save operation can only be executed later.

```js
import { call, put, select, take } from 'redux-saga/effects'
import { serverSave } from '../actions'
import * as PersistenceEngine from './persistence/engine'
import Whitelist from './persistence/whitelist'

const DEBOUNCE_TIME = 3000 // debounce time in milliseconds

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function* persistenceLayer() {
  while (true) {
    const action = yield take()

    if (!Whitelist[action.type]) {
      continue
    }

    const state = yield select()

    yield call(delay, DEBOUNCE_TIME)
    yield put(serverSave.request(action))
    try {
      yield call(PersistenceEngine.save, state, action)
      yield put(serverSave.success())
    } catch (e) {
      yield put(serverSave.failure())
    }
  }
}
```

While this code works, it doesn’t exactly meet the requirements we’ve set for the app. Say that we have three actions (A, B, C) that occur in a 2-second interval between each other. With the code above, there would be two save operations, one 3 seconds after the A action, and another 3 seconds after the C action. The B action would be ignored because the generator would be “blocked” waiting for the delay promise to be fulfilled.

The behavior I’m looking to implement is to only trigger a save operation when no actions are triggered for 3 seconds. So, it would only save 3 seconds after the C operation. To accomplish that, we need a way to say that, if there’s already a scheduled save, reset the `delay` timer and cancel the old scheduled save.

### Running Sagas in the Background (and canceling them)

To implement this, we’ll use the `fork` effect, that runs a task concurrently (`call` waits for the promise to be completed, blocking the saga – we need to keep receiving actions). I like the `fork` analogy, as in `redux-saga` they behave a lot similar to processes forks. Furthermore, `fork`ed processes can be canceled so they’ll work well with our requirements.

```js
import { cancel, call, fork, put, select, take } from 'redux-saga/effects'
import { serverSave } from '../actions'
import * as PersistenceEngine from './persistence/engine'
import Whitelist from './persistence/whitelist'

const DEBOUNCE_TIME = 3000 // debounce time in milliseconds

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// let's separate this function for better readability
function* save(state, action) {
  yield put(serverSave.request(action))
  try {
    yield call(PersistenceEngine.save, state, action)
    yield put(serverSave.success())
  } catch (e) {
    yield put(serverSave.failure())
  }
}

function* debounceSave(state) {
  try {
    yield call(delay, DEBOUNCE_TIME)
    yield call(save, state)
  } catch (e) {
    // empty exception handler because the cancel effect throws an exception
  }
}

export default function* persistenceLayer() {
  // if there's already a delay task running, we want to cancel it
  let debounceTask = null

  while (true) {
    const action = yield take()

    if (!Whitelist[action.type]) {
      continue
    }

    const state = yield select()

    if (debounceTask) {
      yield cancel(debounceTask)
    }

    debounceTask = yield fork(debounceSave, state, action)
  }
}
```

We started by separating the `save` and `debounceSave` generator functions, in order to make the code a bit more easy to read. There’s also a `task` concept that was added, which is the result yielded by `fork`:

- `debounceTask` - this is the yielded value from a `fork`. We need to store it so we can `cancel` the debounce event (check the API for a Task here)
- `cancel` - this is another redux-saga effect, that cancels a forked process. Note that canceling a task throws a `SagaCancellationException` to the generator that was forked.

### Creating a more robust Whitelist

So let’s continue with our requirements. The `CREATE_IMAGE` action needs to be saved immediately, canceling the debouncing, if it’s running. That can easily be done by adding types of persistence to the Whitelist. Let’s separate it into it’s own module and provide an utility function to retrieve the type of persistence:

```js
// persistence/whitelist.js
import * as types from '../../constants/ActionTypes'

export const PersistenceType = {
  IMMEDIATE: 'IMMEDIATE',
  DEBOUNCE: 'DEBOUNCE',
}

const Whitelist = {
  [types.CREATE_IMAGE]: PersistenceType.IMMEDIATE,
  [types.MOVE_IMAGE]: PersistenceType.DEBOUNCE,
}

export function getPersistenceType(type) {
  return Whitelist[type] || null
}
import { cancel, call, fork, put, select, take } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import {
  serverSave,
  signalUnsavedChanges,
  signalSavedChanges,
} from '../actions'
import * as PersistenceEngine from './persistence/engine'
import { getPersistenceType, PersistenceType } from './persistence/whitelist'

const DEBOUNCE_TIME = 3000 // debounce time in milliseconds

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// let's separate this function for better modularity
function* save(state, action) {
  yield put(serverSave.request(action))
  try {
    yield call(PersistenceEngine.save, state, action)
    yield put(serverSave.success())
  } catch (e) {
    yield put(serverSave.failure())
  }
}

function* debounceSave(state) {
  try {
    yield call(delay, DEBOUNCE_TIME)
    yield call(save, state)
  } catch (e) {
    // empty exception handler because the cancel effect throws an exception
  }
}

export default function* persistenceSaga() {
  let debounceTask = null

  while (true) {
    const action = yield take()
    const type = getPersistenceType(action.type)

    if (!type) {
      continue
    }

    const state = yield select()

    if (debounceTask) {
      yield cancel(debounceTask)
    }

    if (type === PersistenceType.IMMEDIATE) {
      yield fork(save, state) // save immediately
    } else if (type === PersistenceType.DEBOUNCE) {
      debounceTask = yield fork(debounceSave, state)
    }
  }
}
```

Notice that we need to `fork` (not `call`) both the `save` and `debounceSave` operations. That way the saga can keep retrieving actions in the background, so that a new `IMMEDIATE` action may cancel a previously scheduled one.

### Signaling unsaved changes

So there’s only one missing requirement: we need to signal the UI when there are unsaved changes. We already dispatch actions when a save request is sent to the server and when it’s fulfilled. But that does not tell us when there are unsaved changes, as there can be changes that are still waiting the debounce timer to complete, which happens before the server request.

We will implement the signaling by dispatching a `UNSAVED_CHANGES` action, waiting for the `SERVER_SAVE_SUCCESS` action, and finally dispatching a `SAVED_CHANGES` action. We will also rely on the Task interface to act as a lock, to prevent multiple UNSAVED_CHANGES dispatches.

```js
import { cancel, call, fork, put, select, take } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import {
  serverSave,
  signalUnsavedChanges,
  signalSavedChanges,
} from '../actions'
import * as PersistenceEngine from './persistence/engine'
import { getPersistenceType, PersistenceType } from './persistence/whitelist'

const DEBOUNCE_TIME = 3000 // debounce time in milliseconds

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// let's separate this function for better modularity
function* save(state, action) {
  yield put(serverSave.request(action))
  try {
    yield call(PersistenceEngine.save, state, action)
    yield put(serverSave.success())
  } catch (e) {
    yield put(serverSave.failure())
  }
}

function* debounceSave(state) {
  try {
    yield call(delay, DEBOUNCE_TIME)
    yield call(save, state)
  } catch (e) {
    // empty exception handler because the cancel effect throws an exception
  }
}

// signals to the UI that there are unsaved changes
export function* signalPersistenceState() {
  yield put(signalUnsavedChanges())
  yield take(types.SERVER_SAVE_SUCCESS) // waits for a SERVER_SAVE success to continue
  yield put(signalSavedChanges())
}

export default function* persistenceSaga() {
  let debounceTask = null
  let unsavedTask = null

  while (true) {
    const action = yield take()
    const type = getPersistenceType(action.type)

    if (!type) {
      continue
    }

    const state = yield select()

    if (debounceTask) {
      yield cancel(debounceTask)
    }

    if (!unsavedTask) {
      unsavedTask = yield fork(signalPersistenceState)
      unsavedTask.done.then(() => {
        unsavedTask = null
      })
    }

    if (type === PersistenceType.IMMEDIATE) {
      yield fork(save, state) // save immediately
    } else if (type === PersistenceType.DEBOUNCE) {
      debounceTask = yield fork(debounceSave, state)
    }
  }
}
```

The trick here is to use `take(ActionTypes.SERVER_SAVE.SUCCESS)`. It will wait until that action has been dispatched, and only then it will signal that there are no saved changes. The UI reducer can reduce those events into a boolean flag, indicating that there are unsaved changes.

### Dressing it up a little

To better abstract and reuse the Lock functionality, I created a `Lock` class, resulting in much cleaner code:

```js
// utils/lock.js
import { cancel, fork } from 'redux-saga/effects'

export default class Lock {
  constructor(func) {
    this.isLocked = false
    this.task = null
    this.func = func
  }

  *execute(...args) {
    if (!this.isLocked) {
      // do not execute if it's locked
      this.isLocked = true
      this.task = yield fork(this.func, ...args)
      this.task.done.then(() => {
        this.isLocked = false
      })
    }
  }

  *cancel() {
    if (this.task) {
      yield cancel(this.task) // reset the delay timeout
    }
  }
}
```

```js
import { call, fork, put, select, take } from 'redux-saga/effects'
import * as types from '../constants/ActionTypes'
import {
  serverSave,
  signalUnsavedChanges,
  signalSavedChanges,
} from '../actions'
import * as PersistenceEngine from './persistence/engine'
import { getPersistenceType, PersistenceType } from './persistence/whitelist'
import Lock from './utils/lock'

const DEBOUNCE_TIME = 3000 // debounce time in milliseconds

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// let's separate this function for better modularity
function* save(state, action) {
  yield put(serverSave.request(state))
  try {
    yield call(PersistenceEngine.save, state, action)
    yield put(serverSave.success())
  } catch (e) {
    yield put(serverSave.failure())
  }
}

function* debounceSave(state) {
  try {
    yield call(delay, DEBOUNCE_TIME)
    yield call(save, state)
  } catch (e) {
    // empty exception handler because the cancel effect throws an exception
  }
}

// signals to the UI that there are unsaved changes
export function* signalPersistenceState() {
  yield put(signalUnsavedChanges())
  yield take(types.SERVER_SAVE_SUCCESS) // waits for a SERVER_SAVE success to continue
  yield put(signalSavedChanges())
}

export default function* persistenceSaga() {
  let debounceLock = new Lock(debounceSave)
  let unsavedLock = new Lock(signalPersistenceState)

  while (true) {
    const action = yield take()
    const type = getPersistenceType(action.type)

    if (!type) {
      continue
    }

    const state = yield select()

    // each persistent action cancels the debounce timer
    yield debounceLock.cancel()

    // this lock prevents multiple unsaved changes actions from being dispatched
    yield unsavedLock.execute()

    if (type === PersistenceType.IMMEDIATE) {
      yield fork(save, state) // save immediately
    } else if (type === PersistenceType.DEBOUNCE) {
      // a new debounce timer is created
      yield debounceLock.execute(state, action)
    }
  }
}
```

### Wrapping up

And that’s all we have to show you today. You can see the example in action (and also a `load` saga, if you were wondering about it) in https://github.com/jportela/redux-saga-persistence

There are a lot more features that we are implementing in our app which may warrant a part II on this topic. I’d personally want to see features such as diffing, so we only send to the server what was changed (although that may be the single responsibility of the `PersistenceEngine`). I hope you liked this article, if you did please share it and let us know your thoughts on it.
