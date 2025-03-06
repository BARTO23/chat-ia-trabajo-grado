const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");

// Verificar si los elementos existen antes de ejecutar el código
if (!chatBody || !messageInput || !sendMessageButton) {
  console.error("Error: No se encontraron algunos elementos del chat.");
} else {
  const createMessageElement = (content, clases) => {
    const div = document.createElement("div");
    div.classList.add("message", clases);
    div.innerHTML = content;
    return div;
  };

  const handleOutgoingMessage = (userMessage) => {
    if (!userMessage.trim()) return; // Evita mensajes vacíos

    const messageContent = `<div class="message-text">${userMessage}</div>`;

    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    chatBody.appendChild(outgoingMessageDiv);

    messageInput.value = ""; // Limpia el campo de entrada después de enviar el mensaje
    chatBody.scrollTop = chatBody.scrollHeight; // Desplaza el chat hacia abajo
  };

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault();
      const userMessage = messageInput.value.trim();
      handleOutgoingMessage(userMessage);
    }
  });

  sendMessageButton.addEventListener("click", () => {
    const userMessage = messageInput.value.trim();
    handleOutgoingMessage(userMessage);
  });
}
