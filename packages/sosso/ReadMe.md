# CinderBlock

Welcome to the CinderBlock programming language! This is very much in infancy but it should run well, if slowly, so you can have a go at getting your projects off of the ground with it.

The language is an entirely pure functional one but JavaScript functions may be injected and they could theoretically have side effects. While it is possible to inject side effects this way, please do not attempt it. Execution order is not guaranteed and a variable may not be calculated if it is not referenced. As such, it would be impossible to assume that a side effect will always work.

# Repo Directory

- `compiler` is the actual compiler and runtime (runtime will be separated soon)
- `tests` are a series of Node Tests which assert the language functionality. They still need a lot of expanding.
- `server` is a super lightweight server framework to show off the options with the language.
- `budget-tracker` is a very early days example app to show how the language may be used in the real world.

## Making the Language Useful

Please see the `server` directory for an example of a basic server framework which utilises a simple JavaScript wrapper around CinderBlock. This framework uses ExpressJS and then utilises the ability to tag `let` instances (which is native to CinderBlock). In order to perform data mutations, a handler may return a list of mutative operations to call with a server response. The server then invokes the implementations of those operations, which are written in TypeScript, before sending the response.

For an example of this in use, see the `budget-tracker` app, which is an incredibly bare bones project that I set up, in order to test out the language in a more "real world" example as I coded it.

## Where Things Are

- A TypeScript written compiler which compiles to a JavaScript object of instructions, which are pre linked.
- A TypeScript written runner which reads the object and executes the instructions.
- The ability to inject in JavaScript functions.
- Some standard library features which are simply thin wrappers around NodeJS abilities.

## The Next Steps

- Write a simple CLI to invoke `let` instances directly.
- Update the JavaScript object that comes out of the compiler to use a byte encoding into a buffer.
- Update the TypeScript runner to be written in C++ and compile to Web Assembly.
- Allow the injection of either JavaScript or C++ functions.
- Fill out the standard libraries to have more use cases.

## The Final Steps

- Rewrite the compiler in CinderBlock.

# Setting Up Your Own Basic Project

First install cinderblock

```Shell
npm install @cinderblock-lang/compiler
```

Create an entrypoint.

```TypeScript
import { Project } from "@cinderblock-lang/compiler";
import path from "node:path";

async function main() {
  const instance = new Project(path.resolve(import.meta.dirname));

  const binary = instance.binary({
    hello(_s: string) {
      return "I am a " + _s;
    }
  });

  console.log(await binary.run("startup",{ func_arg: "I am an argument" }));
}
```

Finally, create a CinderBlock file.

```CinderBlock
extern hello (): string;

let startup (func_arg: string) = "Hello " + func_arg + " and also hello " + ("global" -> hello);
```

Make sure your you have these fields in your `package.json`

```JSON
{
  "type": "module",
  "main": "typescript-file-from-above.ts"
}
```

and run

```Shell
node .
```

This will then print the following to the console.

```
Hello I am an argument and also hello I am a global
```

# Installing the VsCode Extension

The VsCode extension is currently not on the market place. Simply run the `bundle` NPM script in the `vscode-extension` folder and then install from the generated `vsix` file. This should give you basic functionality such as;

- Syntax highlighting
- Go to definition
- Diagnostic issues