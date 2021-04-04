---
title: Animate Radix Primitives with framer-motion
description: How to animate Radix Primitives, styled with styled-components, using framer-motion
date: '2021-04-05'
tags:
  - radix-ui
  - styled-components
  - framer-motion
  - animation
---

Web applications are built upon a set of UI patterns that, unfortunately, are not fully implemented by browsers. Patterns such as accordions, tabs and dialogs don't really have a direct equivalent in HTML, and even select and checkboxes are not easily customizable.

Implementing these from scratch is a demanding task, specially if we aim to make them bug-free, accessible and cross-browser. Radix Primitives offers a low-level UI library that implements common UI patterns, with a focus on accessibility, customization and developer experience. As opposed to other accessibility-focused UI libraries (such as Reach UI or Chakra UI), Radix Primitives are unstyled, which means components ship with zero styles, giving developers complete control of how to style these components.

`styled-components` is one of the most common CSS in JS libraries, that can be used to style these Primitives. Radix Primitives and `styled-components` play along nicely, but once you add `framer-motion` to the mix (in order to provide a more polished and deligthful feel to your components), things are not as intuitive.

This guide shows how to use Radix Primitives, along with styled-components and framer-motion, to build a simple Dropdown, with an animation when opening and closing it.

## Building the initial Dropdown

We start with a simple example, using just the Radix Primitive for the DropdownMenu, without any styles or animations

```
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

## Adding styling to the dropdown

Now let's use `styled-components` for making the Dropdown our own:

```
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

export default function SimpleDropdownPage() {
  return (
    <main>
      <h1>Radix Primitives with styled-components and framer-motion</h1>
      <h2>Simple Dropdown</h2>
      <MenuDropdown />
    </main>
  );
}
```

## Adding animation using framer-motion

```jsx
import * as Menu from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Button, Content as StyledContent, Item } from "./styled";

const Content = styled(StyledContent)`
  transform-origin: top left;
`;

export function MotionMenuDropdown() {
  return (
    <Menu.Root>
      <Button>Open</Button>
      <Content
        forwardedAs={motion.div}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { type: "spring", duration: 0.3 },
        }}
        align="start"
      >
        <Item onSelect={() => console.log("Cut")}>Cut</Item>
        <Item onSelect={() => console.log("Copy")}>Copy</Item>
        <Item onSelect={() => console.log("Paste")}>Paste</Item>
      </Content>
    </Menu.Root>
  );
}
```

## Adding exit animations

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
  const [open, setOpen] = useState(false);
  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Button>Open</Button>
      <AnimatePresence>
        {open ? (
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
            forceMount
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