---
title: The Monorepo
date: '2020-05-05'
tags:
  - Software Development
---

There has been a generalized interest in monolithic architectures, after a rise on distributed architectures. In this post I explore the monorepo, as a way to aggregate and share code in a single repository, and why it's a better approach than breaking the code in separate, distributed, packages, in a JavaScript environment.

### The Distributed Eden

The NodeJS ecosystem popularized the concept of breaking down code into small modules. This resulted in code that was well encapsulated, followed the Do One Thing Well (UNIX) principle, and that could be shared and iterated on an open-source environment, complete with the easy dependency management and discovery provided by NPM.

At the same time, organizations were adopting the same mindset when developing applications. Small pieces of reusable code were separated from the codebase into their own (private) libraries. Applications and libraries could be developed by teams in isolation, providing the same organizational benefits as micro-services.

Libraries and applications were being built on top of isolated pieces of well maintained and tested code, providing an unparalleled developer experience and speed.

But that's not what happens in practice, is it?

### The Maintenance Icarus

[left-pad](https://www.davidhaney.io/npm-left-pad-have-we-forgotten-how-to-program/) showed how depending on something that can be out of control is bad. It's impossible to properly evaluate
