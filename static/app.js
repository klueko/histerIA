console.log("Le fichier app.js est chargé");

class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.open_chat'),
            chatBox: document.querySelector('.chat-container'),
            sendButton: document.querySelector('.submit_button'),
            textField: document.querySelector('.chat-container input'),
            chatMessagesContainer: document.querySelector('.window_messages')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const { openButton, sendButton, textField, chatBox } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));
        textField.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatBox) {
        this.state = !this.state;
        chatBox.classList.toggle('chatbox--active', this.state);
    }

    onSendButton(chatBox) {
        const textField = this.args.textField;
        const messageText = textField.value.trim();

        if (!messageText) return;

        this.addMessage('User', messageText);
        textField.value = '';

        this.sendMessageToBot(messageText)
            .then(response => {
                this.addMessage('Philomène', response.answer);
                this.updateChatText(chatBox);
            })
            .catch(error => {
                console.error('Error:', error);
                this.updateChatText(chatBox);
            });
    }

    addMessage(sender, messageText) {
        this.messages.push({ name: sender, message: messageText });
    }

    sendMessageToBot(messageText) {
        return fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: messageText }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json());
    }

    updateChatText(chatBox) {
        const messagesHtml = this.messages.slice().reverse().map(({ name, message }) => {
            const messageClass = name === "HistérIA" ? "messages_content--visitor" : "messages_content--operator";
            return `<div class="messages_content ${messageClass}">${message}</div>`;
        }).join('');

        this.args.chatMessagesContainer.innerHTML = messagesHtml;
    }
}

const chatbox = new Chatbox();
chatbox.display();
