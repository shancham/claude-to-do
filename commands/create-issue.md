# Create Issue

User is mid-development and thought of a bug/feature/improvement. Capture it fast so they can keep working.

## Your Goal

Create a complete issue with:
- Clear title
- TL;DR of what this is about
- Current state vs expected outcome
- Relevant files that need touching
- Risk/notes if applicable
- Proper type/priority/effort labels

## How to Get There

**Ask questions** to fill gaps - be concise, respect the user's time. They're mid-flow and want to capture this quickly. Usually need:
- What's the issue/feature
- Current behavior vs desired behavior
- Type (bug/feature/improvement) and priority if not obvious

Keep questions brief. One message with 2-3 targeted questions beats multiple back-and-forths.

**Search for context** only when helpful:
- Web search for best practices if it's a complex feature
- Grep codebase to find relevant files
- Note any risks or dependencies you spot

**Skip what's obvious** - If it's a straightforward bug, don't search web. If type/priority is clear from description, don't ask.

**Keep it fast** - Total exchange under 2min. Be conversational but brief. Get what you need, create ticket, done.

## Behavior Rules

- Be conversational - ask what makes sense, not a checklist
- Default priority: normal, effort: medium (ask only if unclear)
- Max 3 files in context - most relevant only
- Bullet points over paragraphs

## Creating the Issue in Linear

After confirming issue details with the user, automatically create it via the Linear GraphQL API.

### Priority mapping
| Label    | Linear value |
|----------|-------------|
| urgent   | 1           |
| high     | 2           |
| normal   | 3           |
| low      | 4           |

### Step 1 — Resolve the team UUID

Read the API key from `.env` and query for the team with key `joinfoodieapp`:

```bash
source .env && curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ teams { nodes { id key } } }"}' \
  | python3 -c "import sys,json; teams=json.load(sys.stdin)['data']['teams']['nodes']; print(next(t['id'] for t in teams if t['key']=='joinfoodieapp'))"
```

### Step 2 — Create the issue

Use the team UUID from step 1 to create the issue. Build the request body as a JSON file to avoid shell escaping issues, then POST it:

```bash
source .env

python3 -c "
import json, sys
body = {
    'query': '''
        mutation CreateIssue(\$input: IssueCreateInput!) {
          issueCreate(input: \$input) {
            success
            issue { id title url }
          }
        }
    ''',
    'variables': {
        'input': {
            'teamId': sys.argv[1],
            'title': sys.argv[2],
            'description': sys.argv[3],
            'priority': int(sys.argv[4])
        }
    }
}
print(json.dumps(body))
" TEAM_UUID "TITLE" "DESCRIPTION" PRIORITY > /tmp/linear_issue.json

curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/linear_issue.json
```

### Step 3 — Confirm to the user

Parse the response and show the user the issue URL (`issue.url`) so they can jump straight to it. If `success` is false or the response contains errors, show the error and do not pretend the issue was created.
