# Why use AppBlocks?

Most modern front-end libraries/frameworks such as Vue, React and Angular are well-suited for building complex, scalable
and maintainable applications if you know how to use them. There is no doupt these are battle tested, production-ready
libraries/frameworks. 

So you propably want to know where AppBlocks shines and how it can help you in developing your
front-end more efficiently.

## So why you should choose AppBlocks?

In one sentence: **AppBlocks has a very low memory footprint and is very easy to integrate in any project.**

The main goals of AppBlocks is to provide all the necessary functionality for developing small-scale front-end apps
without introducing much overhead. Be easy to integrate in any project, to learn and to master. To be simple and
practiclal.

It is tiny **(4.6kB minified | 1.8kB Gzipped)** and all you need to do is to include AppBlocks as a script tag on any
page, spend 10-15 minutes reading the documentation and you're good to go. Yes it's that simple.

That beeing said, AppBlocks is not meant for building large-scale applications. It does not include a router or a
sophisticated state management system. This field is already covered by many well known frameworks and libraries so 
there is no point of introducing another javascript library that does the same thing. If this is your case and you need
to develop a large-scale single page application (SPA), then other frameworks might be a better fit for you.

However, building complex and large-scale SPAs is not always the case. There are cases were you need enhance websites 
or even web applications that do not require a complex front-end.

## A use case example

Lets say that your are developing a traditional web app in django, flask or ruby on rails. Your templates
are handled by their respective template engines on the server. But you want to add some REST features to your front-end
like filling up tables and lists or updating the basket in your e-commerce site without needing to refresh the page 
every single time.

One option would be to use jQuery. It is simple to intergrate and you won't need to change much in the way you do things
when using your framework. But it is huge and will introduce a lot of overhead. Furthermore it doesn't give structure
to your front-end and sooner or later your code will become a pain to maintain.

Another option would be to use a framework that lets you develop all of your front-end in javascript. It doesn't have to
be the entire front-end, but integrating a framework like that in a project usually translates to a lot of rewting and
a lot of changes on how you and your team usually do things.

Wouldn't be nice if there was something you can use that is as easy as jQuery to integrate but does not introduce all
that extra overhead?

AppBlocks comes to solve just that. **Enhancing front-ends with small and maintainable applications fast and easy
without overhead.** What AppBlocks provides out of the box is this:
- Control the structure of your application with an easy to use template syntax that plays nice with server-side
  template engines.
- Template placeholders.
- Template directives.
- Methods handling.
- Events handling.
- Intergration with [Axios](https://github.com/axios/axios) to make requests that affect your App's state.

Here's a comparison of the size of other javascript libraries/frameworks:

Name	| Minified | Gzipped
--|--|--
jQuery 3.5 | 87.6kB | 30.4kB
Vue 2.6.11 | 63.5kB | 22.8kB
React-dom 16.13.1 | 114.6kB | 35.9kB
Angular 1.7.9 | 179.5kB | 61.9kB
Inferno 7.4.2 | 21.2kB | 7.9kB
PReact 10.4.1 | 9.8kB | 3.8kB
**AppBlocks 1.2.3** | **4.6kB** | **1.8kB**

So if you start building an application do consider of giving AppBlocks a try and see how much value you can get out of
a 2kB library.
