# Project setup

Working with Claude Code is more interesting if you have a project to work with.

I've put together a small project to explore with Claude Code. It is the same UI generation app shown in a previous video. Note: you don't have to run this project. You can always follow along with the remainder of the course with your own code base if you wish!

## Setup

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
Thinking - use when you have a complex bit of logic or are troublshooting a particular bug
Planning & Thinking consume additional tokens so that is a factor in usage

### Centre The Text & Icon
"Start a conversation to generate React components
I can help you create buttons, forms, cards, and more"

Screenshot that element. Control+V on Mac into the CLI and ask to centre. 

### Update the user message
Use planning and ultrathinking on this one.

[Image #1] replace the 'str_replace_editor' text with a more user friendly message of what the tool is doing. For example, maybe explain the file is being created or updated, along with the file name. Also, put this in a new component and write tests for it. This is a pretty tough task so ultrathink about the best approach.

### Get Claude to Commit
hi, can you create a commit on the learning branch to explain the last two changes you have implemented?

## Controlling Context

### Custom commands - Audit
Created audit.md that is run by /audit. This runs NPM tests to identify and fix vulnerabilities in the packages.

### Custom commands - Write Tests
Created write_tests.md that uses arguments for input making it flexible and reusable. This example uses a file path but could be any string to give Claude context and direction.

## MCP Servers

## Using playwright

I didn't like the purple theme that it came up with however it does work and with iteration / direction that could have been refined.

Your goal is to improve the component generator prompt @src/lib/prompts/generation.tsx. Here's how: \
\
1. Open a browser and navigate to localhost:3000 \
2. Request a basic component be generated
3. Review the generated component and its source code \
4. Identify areas for improvement
5. Update the prompt library to produce better prompts going forward. Create a new file called generation-new.tsx so I can track the difference.\
\
For now only evaluate visual styling. We don't want components generated that look like typical tailwind components - we want something more original.   

## GitHub Integration

### Using playwright

Example GitHub Action to connect to the site during execution.

### Workflow 
```
      - name: Project Setup
        run: |
          # This will spin up the local instance for Claude to test against
          npm run setup
          npm run dev:daemon

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@beta
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}

          # This is an optional setting that allows Claude to read CI results on PRs
          additional_permissions: |
            actions: read
          
            custom_instructions: |
              The project is already set up with all dependencies installed.
              The server is already running at localhost:3000. Logs from it
              are being written to logs.txt. If needed, you can query the
              db with the 'sqlite3' cli. If needed, use the mcp__playwright
              set of tools to launch a browser and interact with the app.

            mcp_config: |
              {
                "mcpServers": {
                  "playwright": {
                    "command": "npx",
                    "args": [
                      "@playwright/mcp@latest",
                      "--allowed-origins",
                      "localhost:3000;cdn.tailwindcss.com;esm.sh"
                    ]
                  }
                }
              }

            allowed_tools: "Bash(npm:*),Bash(sqlite3:*),mcp__playwright__browser_snapshot,mcp__playwright__browser_click"
```

## Hooks
Example of a pre-tool hook to stop Claude from being able to read the .env file with Grep or Read.

#### settings.local.json

```
    "PreToolUse": [
      {
        "matcher": "Read|Grep",
        "hooks": [
          {
            "type": "command",
            "command": "node ./hooks/read_hook.js"
          }
        ]
      },
```

#### ./hooks/read_hook.js 

```
async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());

  // readPath is the path to the file that Claude is trying to read
  const readPath =
    toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || "";

  // TODO: ensure Claude isn't trying to read the .env file
  if(readPath.includes('.env')){
    console.error("You cannot read the .env file.")
    process.exit(2);
  }
}

main();
```