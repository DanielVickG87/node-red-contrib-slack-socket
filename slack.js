module.exports = function (RED) {
    const { App } = require("@slack/bolt");
    const WebSocket = require("ws");

    function SlackSocketNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const botToken = config.token;
        const appToken = config.appToken;

        if (!botToken || !appToken) {
            node.error("Slack tokens are missing.");
            return;
        }

        // Slack Bolt (Socket Mode)
        const app = new App({
            token: botToken,
            appToken: appToken,
            socketMode: true
        });

        // WebSocket interno Node-RED ⇆ Slack
        const wss = new WebSocket.Server({ noServer: true });

        // Para emitir eventos hacia Node-RED
        function sendToNodeRED(payload) {
            const msg = { payload };
            node.send(msg);
        }

        // Eventos desde Slack hacia Node-RED
        app.event("message", async ({ event }) => {
            sendToNodeRED({
                type: "message",
                user: event.user,
                text: event.text,
                channel: event.channel
            });
        });

        // Iniciar Bolt
        app.start().then(() => {
            node.status({ fill: "green", shape: "dot", text: "Conectado a Slack" });
        }).catch(err => {
            node.error("Error starting Slack: " + err);
        });

        // Mensajes desde Node-RED hacia Slack
        node.on("input", async (msg) => {
            try {
                await app.client.chat.postMessage({
                    channel: msg.payload.channel,
                    text: msg.payload.text
                });

                node.status({ fill: "blue", shape: "dot", text: "Message sent" });

            } catch (e) {
                node.error("Error sending message to Slack: " + e);
            }
        });

        node.on("close", () => {
            try { app.stop(); } catch (e) {}
        });
    }

    RED.nodes.registerType("slack-socket", SlackSocketNode);
};
