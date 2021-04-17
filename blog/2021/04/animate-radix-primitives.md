---
title: Animate Radix Primitives with framer-motion
description: This guide explains how to use Radix Primitives, along with styled-components and framer-motion, to build a simple Dropdown, with an animation when opening and closing it. 
date: '2021-04-17'
tags:
  - radix-ui
  - styled-components
  - framer-motion
  - animation
---

Modern web applications are built upon a set of UI patterns that are not fully implemented by browsers. Patterns such as accordions, tabs and dialogs don't really have a direct equivalent in HTML, and even dropdowns (via `select`) and checkboxes (via `input`) are not easily customizable. Implementing these from scratch is a demanding task, specially if we aim to make them bug-free, accessible and work well cross-browser.

[Radix Primitives](https://radix-ui.com/primitives/docs/overview/introduction) aims to solve this problem, offering a low-level UI library that implements common UI patterns, with a focus on accessibility, customization and developer experience. In contrast with other accessibility-focused UI libraries (such as [Reach UI](https://reach.tech/) or [Chakra UI](https://chakra-ui.com/)), Radix Primitives are unstyled, which means components ship with zero styles, giving developers complete control of how to style these components.

> Both Reach UI and Chakra UI are excellent alternatives for building your UI. Providing good styling defaults out of the box is a big plus for a lot of use cases. Radix Primitives are not inherently better, they just offer different tradeoffs.

[`styled-components`](https://styled-components.com/) is a common _CSS-in-JS_ librariy, that can be used to style these Primitives. Radix Primitives and `styled-components` play along nicely, but once you add [`framer-motion`](https://www.framer.com/motion/) to the mix (in order to provide a more polished feel to your components), you'll realize the setup is not as intuitive.

This guide explains how to use Radix Primitives, along with `styled-components` and `framer-motion`, to build a simple Dropdown, with an animation when opening and closing it, so that you can see an example of how these three libraries can work together.

## Building the initial Dropdown

We start with a simple example, just using `@radix-ui/react-dropdown-menu` (the Radix Primitive for a Dropdown Menu), without any styles or animations. This example has been mostly copied over from the [Radix Primitives documentation](https://radix-ui.com/primitives/docs/components/dropdown-menu), which I suggest reading through if you are looking for more customization options from Radix UI, or what each Primitive does.

```bash
yarn add @radix-ui/react-dropdown-menu # adds the Dropdown Menu package from Radix Primitives
```

```jsx
import * as Menu from "@radix-ui/react-dropdown-menu";

export function SimpleMenuDropdown() {
  return (
    <Menu.Root>
      <Menu.Trigger>Open</Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={() => console.log("Cut")}>Cut</Menu.Item>
        <Menu.Item onSelect={() => console.log("Copy")}>Copy</Menu.Item>
        <Menu.Item onSelect={() => console.log("Paste")}>Paste</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}
```

You can see the result in [radix-motion.joaoportela.com](https://radix-motion.joaoportela.com), under **Menu Dropdown (Simple)**.

> While it seems like a simple component, upon closer inspection you'll notice the [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) attributes in the DOM, and the keyboard interaction, which adds the accessibility benefits, without the complexity of implementing it by yourself.

## Adding styling to the dropdown

One of the advantages of Radix Primitives is that they are _unstyled_. This makes it easy to add our own styles on top of them. Let's use `styled-components` to make the Dropdown our own:

```bash
yarn add styled-components
```

```jsx
import * as Menu from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";

export const Button = styled(Menu.Trigger)`
  font-size: 1.3rem;
  color: white;
  background-color: hsl(19deg 93% 57%);
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  outline-offset: 2px;
  box-shadow: 0px 1px 1px -1px hsl(44deg 13% 11%);
  &:hover,
  &:active {
    background-color: hsl(19deg 93% 44%);
  }
`;

export const Content = styled(Menu.Content)`
  min-width: 150px;
  margin-top: 5px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 5px 15px -5px teal;
`;

export const Item = styled(Menu.Item)`
  font-size: 1.1rem;
  padding: 5px 10px;
  cursor: default;
  &:hover,
  &:focus {
    outline: 0;
    background: rgba(0, 0, 0, 0.1);
  }
`;

export function StyledMenuDropdown() {
  return (
    <Menu.Root>
      <Button>Open</Button>
      <Content align="start">
        <Item onSelect={() => console.log("Cut")}>Cut</Item>
        <Item onSelect={() => console.log("Copy")}>Copy</Item>
        <Item onSelect={() => console.log("Paste")}>Paste</Item>
      </Content>
    </Menu.Root>
  );
}
```

You can see the result in [radix-motion.joaoportela.com](https://radix-motion.joaoportela.com), under **Menu Dropdown (Styled)**.


> You'll notice that there was some restyling we needed to do on the `Button` (clearing the border, for example), but that's because `Menu.Trigger` uses a plain HTML button, which includes the default CSS styling applied to buttons by the browser.

The button and dropdown gets more personality, but adding animations will really make it stand out.

## Adding animation using framer-motion

> If you are not familiar with `framer-motion` I recommend [reading through the official documentation](https://www.framer.com/api/motion) and also the excellent free mini-course from [Sid](https://twitter.com/siddharthkp), at [interactive-react.com](https://interactive-react.com/).

For simplicity and reusability sake, we are importing the same Styled Components from the example above.

```bash
yarn add framer-motion
```

```jsx
import * as Menu from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Button, Content as StyledContent, Item } from "./styled";

const Content = styled(StyledContent)`
  transform-origin: top left; /* we want the scaling animation to come from the top-left corner */
`;

export function MotionMenuDropdown() {
  return (
    <Menu.Root>
      <Button>Open</Button>
      <Content
        forwardedAs={motion.div} // notice forwardedAs, instead of as
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { type: "spring", duration: 0.3 },
        }}
        align="start" // we want it to align to the left
      >
        <Item onSelect={() => console.log("Cut")}>Cut</Item>
        <Item onSelect={() => console.log("Copy")}>Copy</Item>
        <Item onSelect={() => console.log("Paste")}>Paste</Item>
      </Content>
    </Menu.Root>
  );
}
```

> **The most important point to get all three libraries working properly, is to use `forwardedAs` on your Styled Component, instead of `as`.**

By using [`forwardedAs`](https://styled-components.com/docs/api#forwardedas-prop), `styled-components` will make sure the `motion.div` gets forwarded all the way to the Radix Primitive (in this case, `Menu.Content`), instead of stopping on the Styled Component:

```jsx
const Component = styled(Menu.Container)``

// ❌ WRONG: it will essentially replace Menu.Container with motion.div, so the Dropdown won't work
<Component as={motion.div} />

// ✅ CORRECT: it will **forward** the motion.div properly to the Menu.Container, so all works well
<Component forwardedAs={motion.div} />
```

You can see the result in [radix-motion.joaoportela.com](https://radix-motion.joaoportela.com), under **Menu Dropdown (Motion)**.

We now have a satisfying animation when the Dropdown opens, but it closes instantly. We want to mirror the animation when it closes, so we need to add an exit animation.

## Adding exit animations

To add exit animations we need to add the [`<AnimatePresence>`](https://www.framer.com/api/motion/animate-presence/) component from `framer-motion`, and take control of the state of the Dropdown, so we can render it or not, depending on whether it is opened or closed.

Fortunately, the Radix Primitive for the Dropdown makes this easy, by using the `open` and `onOpenChange` props on the `Root`:

```jsx
import { useState } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Content as StyledContent, Item } from "./styled";

const Content = styled(StyledContent)`
  transform-origin: top left;
`;

export function FinalMenuDropdown() {
  // using the plain useState React Hook to control the state of the dropdown
  const [open, setOpen] = useState(false); // by default it is closed

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Button>Open</Button>
      <AnimatePresence>
        {open ? ( // if it is opened, render the Content. Otherwise, don't render anything (null)
          <Content
            forwardedAs={motion.div}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { type: "spring", duration: 0.3 },
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
            align="start"
            forceMount // forceMount will always mount the Content, see note below
          >
            <Item onSelect={() => console.log("Cut")}>Cut</Item>
            <Item onSelect={() => console.log("Copy")}>Copy</Item>
            <Item onSelect={() => console.log("Paste")}>Paste</Item>
          </Content>
        ) : null}
      </AnimatePresence>
    </Menu.Root>
  );
}
```

> `forceMount` will always render the Content of the Dropdown. We need this, because otherwise the Content would be removed from the DOM before `framer-motion` has a chance to gradually set the opacity to 0, and thus the animation would not happen at all.

You can see the result in [radix-motion.joaoportela.com](https://radix-motion.joaoportela.com), under **Menu Dropdown (Final)**.

## Wrapping up

> All the code is available at https://github.com/jportela/radix-primitives-styled-motion-example, set up as a [Next.js](https://www.nextjs.org/) app.
