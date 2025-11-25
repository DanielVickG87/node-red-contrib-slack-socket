# node-red-contrib-slack-socket

A Node-RED node that enables real-time bi-directional communication with Slack using the **Slack RTM API (Socket Mode)**.  

This node allows you to:
- Receive messages from any Slack channel, DM or app mention.
- Send messages from Node-RED to Slack using the same authenticated connection.
- Run a persistent background Slack RTM client that automatically reconnects.
- Avoid the need for external tunnels (like ngrok), as Slack Socket Mode requires **no public URL**.

This package is useful when building:
- ChatOps automations
- Monitoring or alerting pipelines
- IoT → Slack integrations
- Slack assistants connected to industrial SCADA/PLC systems
- Internal automation bots without requiring slash commands or HTTP endpoints

---

# 🔧 Installation

### **Using npm**
```bash
cd ~/.node-red
npm install node-red-contrib-slack-socket
```
---
# 🧩 Node Description

This package provides two main components:

1. Slack RTM Listener Node

Creates a persistent connection to Slack using your SLACK_APP_TOKEN and receives all Slack messages allowed by your app permissions.

Outputs a msg object like:

{
  "type": "slack_event",
  "event": "message",
  "user": "U1234567",
  "text": "hello world",
  "channel": "C9876543",
  "ts": "1731530820.239629"
}

2. Slack RTM Sender Node

Allows you to send Slack messages using:

msg.payload = {
    channel: "CHANNEL_ID",
    text: "Your message text"
};

# ⚙️ Slack Configuration (Required)

Follow these steps to configure Slack:

1. Create a Slack App

https://api.slack.com/apps

2. Enable Socket Mode

Slack App → Settings → Socket Mode → Enable

3. Add Required OAuth Scopes

Bot Token Scopes:

app_mentions:read

channels:history

chat:write

groups:history

im:history

mpim:history

4. Install the App into Your Workspace

Slack App → Install App → Install

5. Retrieve Tokens

You will need:

Token Type	Purpose
SLACK_APP_TOKEN (starts with xapp-)	Required for RTM (Socket Mode)
SLACK_BOT_TOKEN (starts with xoxb-)	Required for sending messages

Insert these tokens in the node configuration inside Node-RED.

# 🚀 Usage Examples
1. Receiving messages

Connect the Slack RTM Listener node to a debug node.

No payload is required; socket mode starts automatically.

Output example:

{
  "type": "slack_event",
  "event": "message",
  "user": "U13579",
  "text": "Temperature is too high!",
  "channel": "C24680"
}

2. Sending messages from Node-RED

Inject:

{
  "channel": "C24680",
  "text": "Hello from Node-RED!"
}


Function node "Format message":

msg.payload = {
    channel: "C24680",
    text: "Hello from Node-RED!"
};
return msg;


Connect it to Slack RTM Sender.

# 🔄 Auto-Reconnect Feature

The Slack RTM connection automatically:

Reconnects on network failures

Resumes after computer sleep

Handles Slack server restarts

No user intervention is required.

🛠 Advanced Use Cases
Trigger flows on keyword
if (msg.text.includes("status")) {
    msg.payload = "System OK";
    return msg;
}
return null;

Forward alerts to Slack

Use MQTT → Function → Slack RTM Sender.

Control Node-RED flows from Slack

Use the Listener node + Switch node.

# 🧪 Testing

You can verify your Slack tokens by running:

node slack-socket.js


You should see:

Slack Bolt connected in Socket Mode…
