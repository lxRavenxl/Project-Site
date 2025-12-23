// chat.js
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.widget-chat')) return;

    const chatDiv = document.createElement('div');
    chatDiv.className = 'widget-chat';
    Object.assign(chatDiv.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '9999',
    });

    chatDiv.innerHTML = `
      <a href="https://join.slack.com/t/vvv-circket/shared_invite/zt-3lvxt5b78-FeMW63Kf33RJ5qNCuJkZPQ" target="_blank" rel="noopener noreferrer"
         style="
           display: flex;
           align-items: center;
           gap: 6px;
           padding: 8px 16px;
           background-color: #dc2626;
           color: white;
           font-weight: 600;
           font-size: 14px;
           border-radius: 9999px;
           box-shadow: 0 4px 6px rgba(0,0,0,0.2);
           text-decoration: none;
           transition: background 0.2s, transform 0.2s;
         "
         onmouseover="this.style.background='#b91c1c'; this.style.transform='scale(1.05)';"
         onmouseout="this.style.background='#dc2626'; this.style.transform='scale(1)';"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24">
          <path d="M6,15A2,2 0 0,1 4,17A2,2 0 0,1 2,15A2,2 0 0,1 4,13H6V15M7,15A2,2 0 0,1 9,13A2,2 0 0,1 11,15V20A2,2 0 0,1 9,22A2,2 0 0,1 7,20V15M9,7A2,2 0 0,1 7,5A2,2 0 0,1 9,3A2,2 0 0,1 11,5V7H9M9,8A2,2 0 0,1 11,10A2,2 0 0,1 9,12H4A2,2 0 0,1 2,10A2,2 0 0,1 4,8H9M17,10A2,2 0 0,1 19,8A2,2 0 0,1 21,10A2,2 0 0,1 19,12H17V10M16,10A2,2 0 0,1 14,12A2,2 0 0,1 12,10V5A2,2 0 0,1 14,3A2,2 0 0,1 16,5V10M14,18A2,2 0 0,1 16,20A2,2 0 0,1 14,22A2,2 0 0,1 12,20V18H14M14,17A2,2 0 0,1 12,15A2,2 0 0,1 14,13H19A2,2 0 0,1 21,15A2,2 0 0,1 19,17H14Z"></path>
        </svg>
        <span>Chat</span>
      </a>
    `;

    document.body.appendChild(chatDiv);
  });
})();


