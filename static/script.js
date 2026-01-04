// DOM Elements
const healthStatus = document.getElementById('healthStatus');
const serverInfo = document.getElementById('serverInfo');
const apiResponse = document.getElementById('apiResponse');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const calcResult = document.getElementById('calcResult');

// Base URL
const baseUrl = window.location.origin;

// Format JSON for display
function formatJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

// Update server info from template
function updateServerInfo() {
    // Info sudah di-render server-side
    console.log('Server info loaded');
}

// Check health status
async function checkHealth() {
    showLoading(healthStatus);
    
    try {
        const response = await fetch(`${baseUrl}/api/health`);
        const data = await response.json();
        
        healthStatus.innerHTML = `
            <div class="server-info-item">
                <span class="label">Status:</span>
                <span class="value" style="color: #28a745">${data.status.toUpperCase()}</span>
            </div>
            <div class="server-info-item">
                <span class="label">Service:</span>
                <span class="value">${data.service}</span>
            </div>
            <div class="server-info-item">
                <span class="label">Timestamp:</span>
                <span class="value">${new Date(data.timestamp).toLocaleString()}</span>
            </div>
            <div class="server-info-item">
                <span class="label">Environment:</span>
                <span class="value">${data.environment}</span>
            </div>
            <div class="server-info-item">
                <span class="label">Region:</span>
                <span class="value">${data.region}</span>
            </div>
        `;
        
        showResponse('Health Check', data);
    } catch (error) {
        healthStatus.innerHTML = `
            <div class="server-info-item">
                <span class="label">Status:</span>
                <span class="value" style="color: #dc3545">ERROR</span>
            </div>
            <div class="server-info-item">
                <span class="label">Error:</span>
                <span class="value">${error.message}</span>
            </div>
        `;
        
        showResponse('Health Check Error', { error: error.message });
    }
}

// Get server info via API
async function getServerInfo() {
    try {
        const response = await fetch(`${baseUrl}/api/server-info`);
        const data = await response.json();
        showResponse('Server Info', data);
    } catch (error) {
        showResponse('Server Info Error', { error: error.message });
    }
}

// Generate dummy data
async function generateData() {
    try {
        const response = await fetch(`${baseUrl}/api/generate-data`);
        const data = await response.json();
        showResponse('Generated Data', data);
    } catch (error) {
        showResponse('Generate Data Error', { error: error.message });
    }
}

// Send echo message
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Please enter a message');
        return;
    }
    
    try {
        const response = await fetch(`${baseUrl}/api/echo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        showResponse('Echo Response', data);
        
        // Clear input
        messageInput.value = '';
        
        // Refresh messages
        loadMessages();
    } catch (error) {
        showResponse('Echo Error', { error: error.message });
    }
}

// Load messages
async function loadMessages() {
    try {
        const response = await fetch(`${baseUrl}/api/messages`);
        const data = await response.json();
        
        messagesList.innerHTML = '';
        
        if (data.messages.length === 0) {
            messagesList.innerHTML = '<div class="loading">No messages yet</div>';
            return;
        }
        
        data.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-item';
            messageDiv.innerHTML = `
                <div class="message-meta">
                    <span>ID: ${msg.id}</span>
                    <span>${new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <div class="message-text">${msg.message}</div>
            `;
            messagesList.appendChild(messageDiv);
        });
        
        showResponse('Messages Loaded', data);
    } catch (error) {
        showResponse('Messages Error', { error: error.message });
    }
}

// Perform calculation
async function calculate() {
    const a = document.getElementById('calcA').value;
    const b = document.getElementById('calcB').value;
    const operation = document.getElementById('calcOp').value;
    
    if (!a || !b) {
        alert('Please enter both numbers');
        return;
    }
    
    try {
        const response = await fetch(`${baseUrl}/api/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                a: parseFloat(a), 
                b: parseFloat(b), 
                operation 
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            calcResult.innerHTML = `
                <div style="color: #dc3545; text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Calculation Error</h3>
                    <p>${data.error}</p>
                </div>
            `;
        } else {
            calcResult.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3>Result</h3>
                    <div style="font-size: 3em; color: #28a745; margin: 20px 0;">
                        ${data.result}
                    </div>
                    <p>${data.a} ${getOperationSymbol(data.operation)} ${data.b} = ${data.result}</p>
                    <p style="color: #666; font-size: 0.9em;">
                        Calculated at ${new Date(data.calculated_at).toLocaleString()}
                    </p>
                </div>
            `;
        }
        
        showResponse('Calculation', data);
    } catch (error) {
        calcResult.innerHTML = `
            <div style="color: #dc3545; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${error.message}</p>
            </div>
        `;
        showResponse('Calculation Error', { error: error.message });
    }
}

function getOperationSymbol(op) {
    const symbols = {
        'add': '+',
        'subtract': '-',
        'multiply': '×',
        'divide': '÷'
    };
    return symbols[op] || op;
}

// Show response in response area
function showResponse(title, data) {
    apiResponse.innerHTML = `
        <h4>${title}</h4>
        <pre>${formatJSON(data)}</pre>
    `;
}

// Show loading state
function showLoading(element) {
    element.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i> Loading...
        </div>
    `;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial checks
    checkHealth();
    loadMessages();
    updateServerInfo();
    
    // Button event listeners
    document.getElementById('healthBtn').addEventListener('click', checkHealth);
    document.getElementById('serverInfoBtn').addEventListener('click', getServerInfo);
    document.getElementById('generateDataBtn').addEventListener('click', generateData);
    document.getElementById('loadMessagesBtn').addEventListener('click', loadMessages);
    document.getElementById('calculateBtn').addEventListener('click', calculate);
    
    // Send message on button click or Enter key
    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-refresh health every 30 seconds
    setInterval(checkHealth, 30000);
    
    console.log('Render Test App initialized');
});
