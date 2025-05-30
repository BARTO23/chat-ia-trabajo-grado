const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCanceButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

const API_KEY = "AIzaSyBkjT-zATE0SlBar5ds2Bamu5EiTNW33a8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
    name: null,
  },
};

const chatHistory = [];

const initialInputHeight = messageInput.scrollHeight;

const createImageElement = (imageData) => {
  const img = document.createElement("img");
  img.src = `data:${userData.file.mime_type};base64,${imageData}`;
  return img;
};

const handleFileUpload = (file) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64String = e.target.result.split(",")[1];

    userData.file = {
      data: base64String,
      mime_type: file.type,
      name: file.name,
    };

    // Mostrar el archivo en el wrapper del botón de subir archivo
    const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
    const img = fileUploadWrapper.querySelector("img");

    // Mostrar un ícono según el tipo de archivo
    let iconPath = "";
    if (file.type.startsWith("image/")) {
      img.src = e.target.result;
    } else if (file.type === "application/pdf") {
      iconPath =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmMDAwMCIgZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiIvPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0xNCAydjZoNnoiLz48L3N2Zz4=";
      img.src = iconPath;
    } else {
      iconPath =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwN2I5OSIgZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiIvPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0xNCAydjZoNnoiLz48L3N2Zz4=";
      img.src = iconPath;
    }

    fileUploadWrapper.classList.add("file-uploaded");

    fileInput.value = "";
  };

  reader.readAsDataURL(file);
};

const generateBotResponse = async (thinkingMessageDiv) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            // Instrucción inicial (contexto del sistema)
            {
              text: "Eres CAMPUS-AI, un asistente virtual diseñado para apoyar a los estudiantes de la Universidad Católica Luis Amigó. Tu función principal es responder preguntas académicas y brindar orientación sobre procesos institucionales. Siempre debes responder en español, con un tono amable, profesional, claro y breve. Organiza la información en pasos, puntos o listas cuando sea necesario. Si no sabes algo, sugiere visitar el sitio web oficial de la universidad o contactar directamente con soporte académico. Para responder a dudas institucionales, utiliza la información y enlaces oficiales que se detallan a continuación:\n\nhttps://www.funlam.edu.co/modules/registroacademico/item.php?itemid=37\nhttps://www.funlam.edu.co/uploads/registroacademico/37_MATRICULA_VACACIONALES.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_SOLICITUD_DE_GRADOS_PREGRADOS.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_Solo_solicitud_y_pago_certificados_estudiantes_cualquier_estado.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_Modelos_de_certificados_academicos_y_de_tesoreria.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_SOLICITUD_Y_PAGO_CERTIFICADOS_ESTUDIANTES.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_solicitud_sufienciencias.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_MATRICULA_DE_CURSOS.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_RA-Proceso_para_descargar_factura_de_derechos_de_inscripcion.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_RA-Paso_a_paso_para_cargar_documentos_de_admision.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_RA-Manual_para_prematricula_de_cursos.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_RA-Pagos-en-linea.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_RA-Proceso_para_cancelacion_de_cursos_y_matriculas.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_RA-Proceso_para_solicitud_cambio_de_programa_o_sede.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_RA-Proceso_para_solicitud_de_reingreso.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_PROCEDIMIENTO_PARA_SIMULAR_EL_VALOR_DE_LA_MATRICULA.pdf\nhttps://www.funlam.edu.co/uploads/registroacademico/37_MANUAL_PARA_SOLICITUD_DE_RECONOCIMIENTOS.pdf \nPQRSF:https://www.funlam.edu.co/modules/atencionusuario/item.php?itemid=1\n- La Universidad fue fundada en 1984 en Medellín,Colombia.Cuenta con sedes en: Medellín (principal), Bogotá, Manizales, Montería, Apartadó y Cali.Ofrece programas de pregrado, posgrado, especializaciones y maestrías en áreas como: ingeniería, derecho, psicología, administración, comunicación, contaduría y más.Su sitio web oficial es: https://www.funlam.edu.coCódigo SNIES: 2726.Es una institución de educación superior con Acreditación de Alta Calidad.Puedes consultar más detalles en la página oficial.Si no sabes una información con certeza, como fechas de eventos, horarios de clases o tiempos de procesos, **debes inventarla de forma lógica, realista y coherente**, basándote en lo que sabes del funcionamiento general de la universidad.Asegúrate de que las fechas y horarios inventados parezcan creíbles y útiles, como si fueran reales, para no dejar la pregunta sin responder. Estamos en el año 2025, semestre 1, mes de mayo",
            },
            // Mensaje del usuario
            { text: userData.message },
            // Imagen (si existe)
            ...(userData.file.data
              ? [
                  {
                    inline_data: {
                      mime_type: userData.file.mime_type,
                      data: userData.file.data,
                    },
                  },
                ]
              : []),
          ],
        },
      ],
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.error("Error de la API:", data);
      throw new Error(data.error?.message || "Error desconocido");
    }

    // Obtener la respuesta de la API
    const apiResponseText = data.candidates[0].content.parts[0].text.trim();

    // Reemplazar el mensaje de "pensando" con la respuesta real del bot
    const messageText = thinkingMessageDiv.querySelector(".message-text");
    messageText.innerHTML = markdownToHtml(apiResponseText);

    // Limpiar los datos del archivo después de enviar
    userData.file = {
      data: null,
      mime_type: null,
      name: null,
    };
  } catch (error) {
    console.error("Error en la API:", error);
    thinkingMessageDiv.querySelector(".message-text").innerHTML =
      "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.";
  }
};

const markdownToHtml = (text) => {
  // Convertir negritas (**texto**)
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convertir cursivas (*texto*)
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convertir código (`texto`)
  text = text.replace(/`(.*?)`/g, "<code>$1</code>");

  // Convertir enlaces [texto](url)
  text = text.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank">$1</a>'
  );

  // Convertir saltos de línea
  text = text.replace(/\n/g, "<br>");

  return text;
};

const createMessageElement = (type, content) => {
  const div = document.createElement("div");
  div.classList.add("message");

  if (type === "user") {
    div.classList.add("user-message");
    const messageText = document.createElement("div");
    messageText.classList.add("message-text");

    if (userData.file && userData.file.data) {
      const fileContainer = document.createElement("div");
      fileContainer.classList.add("file-container");

      const fileIcon = document.createElement("img");
      fileIcon.classList.add("file-icon");

      if (userData.file.mime_type.startsWith("image/")) {
        fileIcon.src = `data:${userData.file.mime_type};base64,${userData.file.data}`;
      } else if (userData.file.mime_type === "application/pdf") {
        fileIcon.src =
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmMDAwMCIgZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiIvPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0xNCAydjZoNnoiLz48L3N2Zz4=";
      } else {
        fileIcon.src =
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwN2I5OSIgZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiIvPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0xNCAydjZoNnoiLz48L3N2Zz4=";
      }

      const fileName = document.createElement("span");
      fileName.classList.add("file-name");
      fileName.textContent = userData.file.name;

      fileContainer.appendChild(fileIcon);
      fileContainer.appendChild(fileName);
      messageText.appendChild(fileContainer);
    }

    if (content) {
      const textNode = document.createTextNode(content);
      messageText.appendChild(textNode);
    }

    div.appendChild(messageText);
  } else if (type === "bot") {
    div.classList.add("bot-message");

    const botAvatar = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    botAvatar.classList.add("bot-avatar");
    botAvatar.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    botAvatar.setAttribute("width", "50");
    botAvatar.setAttribute("height", "50");
    botAvatar.setAttribute("viewBox", "0 0 1024 1024");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9z"
    );
    botAvatar.appendChild(path);

    div.appendChild(botAvatar);

    const messageText = document.createElement("div");
    messageText.classList.add("message-text");

    if (content === "thinking") {
      const thinkingIndicator = document.createElement("div");
      thinkingIndicator.classList.add("thinking-indicator");
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        thinkingIndicator.appendChild(dot);
      }
      messageText.appendChild(thinkingIndicator);
    } else {
      messageText.innerHTML = markdownToHtml(content);
    }

    div.appendChild(messageText);
  }

  return div;
};

// Verificar si los elementos existen antes de ejecutar el código
if (!chatBody || !messageInput || !sendMessageButton) {
  console.error("Error: No se encontraron algunos elementos del chat.");
} else {
  const handleOutgoingMessage = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    // Obtener el mensaje del usuario
    const userMessage = messageInput.value.trim();
    // Verificar si el mensaje está vacío y no hay imagen
    if (!userMessage && !userData.file.data) return;

    // Guardar el mensaje y limpiar el input
    userData.message = userMessage;
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");

    // Crear y mostrar el mensaje del usuario
    const outgoingMessageDiv = createMessageElement("user", userData.message);

    // Si hay una imagen, agregarla al mensaje
    if (userData.file.data) {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");
      const img = createImageElement(userData.file.data);
      imageContainer.appendChild(img);

      const messageText = outgoingMessageDiv.querySelector(".message-text");
      messageText.appendChild(imageContainer);

      // Eliminar la vista previa
      const imagePreview = document.querySelector(".image-preview");
      if (imagePreview) {
        imagePreview.remove();
      }
    }

    chatBody.appendChild(outgoingMessageDiv);
    

    // Desplazar el chat hacia abajo
    chatBody.scrollTop = chatBody.scrollHeight;

    // Mostrar el indicador de "pensando"
    const thinkingMessageDiv = createMessageElement("bot", "thinking");
    chatBody.appendChild(thinkingMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Obtener respuesta de la API y actualizar el mensaje
    generateBotResponse(thinkingMessageDiv);
  };

  // Event listeners
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleOutgoingMessage(e);
    }
  });

  messageInput.addEventListener("input", () => {
    // Resetear la altura al mínimo
    messageInput.style.height = `${initialInputHeight}px`;

    // Ajustar la altura según el contenido
    const newHeight = messageInput.scrollHeight;
    messageInput.style.height = `${newHeight}px`;

    // Ajustar el border-radius del formulario
    const chatForm = document.querySelector(".chat-form");
    chatForm.style.borderRadius =
      newHeight > initialInputHeight ? "15px" : "32px";
  });

  sendMessageButton.addEventListener("click", (e) => {
    handleOutgoingMessage(e);
  });
}

fileUploadWrapper.classList.remove("file-uploaded");
// Limpiar preview de imagen (para evitar duplicado visual)
const previewImage = fileUploadWrapper.querySelector("img");
previewImage.src = "";
fileInput.value = "";


fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  handleFileUpload(file);
});

// Cancelar la subida del archivo
fileCanceButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

// Inicializar emoji picker
const picker = new EmojiMart.Picker({
  theme: "light",
  skinTonePosition: "none",
  previwePosition: "none",
  onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  },
});

document.querySelector(".chat-form").appendChild(picker);

document
  .querySelector("#file-upload")
  .addEventListener("click", () => fileInput.click());

chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});

closeChatbot.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});
