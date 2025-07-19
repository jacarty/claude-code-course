# Project setup

Working with Claude Code is more interesting if you have a project to work with.

I've put together a small project to explore with Claude Code. It is the same UI generation app shown in a previous video. Note: you don't have to run this project. You can always follow along with the remainder of the course with your own code base if you wish!

##  Setup

This project requires a small amount of setup:

Download the zip file called uigen.zip attached to this lecture and extract it
In the project directory, run npm run setup to install dependencies and set up a local SQLite database
Optional: this project uses Claude through the Anthropic API to generate UI components. If you want to fully test out the app, you will need to provide an API key to access the Anthropic API. This is optional. If no API key is provided, the app will still generate some static fake code. Here's how you can set the api key:
- Get an Anthropic API key at https://console.anthropic.com/
- Place your API key in the .env file.
Start the project by running npm run dev

## Making Changes

### Planning and Thinking
Planning - use when you have wide tasks or several steps to complete
Thiking - use when you have a complex bit of logic or are troublshooting a particular bug
Planning & Thinking consume additional tokens so that is a factor in usage

### Centre The Text & Icon
"Start a conversation to generate React components
I can help you create buttons, forms, cards, and more"

Screenshot that elemnent. Control+V on Mac into the Cli and ask to centre. 

### Update the user message
Use planning and ultrathiking on this one.

[Image #1] replace the 'str_replace_editor' text with a more user friendly message of what the tool is doing. For example, maybe explain the file is being created or updated, along with the file name. Also, put this in a new component and write tests for it. This is a pretty tough task so ultrathink about the best approach.

### Get Claude to Commit
hi, can you create a commit on the learning branch to explain the last two changes you have implemented?

## Controlling Context

### Custom commands - Audit
Created audit.md that is run bu /audit. This runs NMP tests to identify and fix vulnerabilities in the packages.

### Custom commands - Write Tests
Created write_tests.md that uses arguments for input making it flexible and reusable. This example uses a file path but could be any string to give Claude context and direction.

## MCP Servers

## Using playwright

I didn't like the purple theme that it came up with however it does work and with iteration / direction that could have been refined.

Your goal is to improve the component generator prompt @src/lib/prompts/generation.tsx. Here's how: \
\
1. Open a browser and navigate to localhost:3000 \
2. Request a basic component be generated
3. Review the generated component and it's source code \
4. Identify areas for improvement
5. Update the prompt library to produce better prompts going foward. Create a new file called generation-new.tsx so I can track the difference.\
\
For now only evaluation visual styling. We don't want components generated that look like typical tailwind components - we want something more original.   