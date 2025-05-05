document.addEventListener('DOMContentLoaded', function() {
    // AI Chat Widget
    const chatButton = document.querySelector('.chat-button');
    const chatContainer = document.querySelector('.chat-container');
    const closeChat = document.querySelector('.close-chat');
    const chatForm = document.querySelector('.chat-initial-form');
    const chatBody = document.querySelector('.chat-body');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const sendMessage = document.querySelector('.send-message');
    const startChatBtn = document.querySelector('.start-chat-btn');
    
    // Chat toggle
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            chatContainer.classList.add('active');
        });
    }
    
    if (closeChat) {
        closeChat.addEventListener('click', function() {
            chatContainer.classList.remove('active');
        });
    }
    
    // Start chat after form submission
    if (startChatBtn) {
        startChatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const nameInput = document.querySelector('#user-name');
            const goalInput = document.querySelector('#user-goal');
            const levelInput = document.querySelector('#user-level');
            
            if (!nameInput.value || !goalInput.value || !levelInput.value) {
                alert('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            // Store user info
            const userData = {
                name: nameInput.value,
                goal: goalInput.value,
                level: levelInput.value
            };
            
            localStorage.setItem('jamawi_user_data', JSON.stringify(userData));
            
            // Send email notification about new chat user
            sendChatUserNotification(userData);
            
            // Hide form and show chat
            chatForm.style.display = 'none';
            chatMessages.style.display = 'block';
            document.querySelector('.chat-footer').style.display = 'flex';
            
            // Send welcome message
            setTimeout(() => {
                addBotMessage(`مرحبا ${userData.name}! أنا هنا لمساعدتك في الوصول إلى هدفك: ${userData.goal}. بناءً على مستواك (${userData.level})، سأقدم لك توصيات مخصصة.`);
                setTimeout(() => {
                    addBotMessage("هل لديك أي متطلبات خاصة أو قيود يجب أن أضعها في الاعتبار؟");
                }, 1000);
            }, 500);
        });
    }
    
    // Send message
    if (sendMessage) {
        sendMessage.addEventListener('click', sendUserMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }
    
    function sendUserMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addUserMessage(message);
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process the message and respond
        setTimeout(() => {
            respondToMessage(message);
        }, 1500);
    }
    
    function addUserMessage(message) {
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `
            <div class="message-content">${message}</div>
        `;
        chatMessages.appendChild(userMessage);
        scrollToBottom();
        
        // Send email notification about the user message
        const userData = JSON.parse(localStorage.getItem('jamawi_user_data') || '{}');
        sendChatMessageNotification(userData, message, 'user');
    }
    
    function addBotMessage(message) {
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot';
        botMessage.innerHTML = `
            <div class="message-content">${message}</div>
        `;
        
        // Remove typing indicator if exists
        const typingIndicator = document.querySelector('.chat-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        chatMessages.appendChild(botMessage);
        scrollToBottom();
        
        // Send email notification about the bot message
        const userData = JSON.parse(localStorage.getItem('jamawi_user_data') || '{}');
        sendChatMessageNotification(userData, message, 'bot');
    }
    
    function showTypingIndicator() {
        // Remove existing typing indicator if any
        const existingIndicator = document.querySelector('.chat-typing');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        const typing = document.createElement('div');
        typing.className = 'chat-typing';
        typing.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typing);
        scrollToBottom();
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function respondToMessage(message) {
        // Get user data
        const userData = JSON.parse(localStorage.getItem('jamawi_user_data') || '{}');
        
        // Simple AI response logic based on keywords
        const lowercaseMsg = message.toLowerCase();
        
        if (lowercaseMsg.includes('خطة') || lowercaseMsg.includes('برنامج') || lowercaseMsg.includes('تدريب')) {
            if (userData.goal === 'بناء العضلات') {
                addBotMessage('بناءً على هدفك في بناء العضلات، أوصي بخطة تدريبية 5 أيام في الأسبوع، مع التركيز على مجموعات عضلية مختلفة كل يوم. هل تود الحصول على مزيد من المعلومات حول خطتنا الكاملة لبناء العضلات؟');
                setTimeout(() => {
                    const plansLink = document.createElement('div');
                    plansLink.className = 'chat-message bot';
                    plansLink.innerHTML = `
                        <div class="message-content">
                            <a href="pages/plans.html" class="chat-link">استعرض خطة بناء العضلات</a>
                        </div>
                    `;
                    chatMessages.appendChild(plansLink);
                    scrollToBottom();
                }, 1000);
            } else if (userData.goal === 'خسارة الوزن' || userData.goal === 'حرق الدهون') {
                addBotMessage('لهدفك في خسارة الوزن، أنصح بمزيج من تمارين الكارديو وتمارين المقاومة، مع نظام غذائي متوازن. خطتنا لحرق الدهون تناسب احتياجاتك تماماً.');
                setTimeout(() => {
                    const plansLink = document.createElement('div');
                    plansLink.className = 'chat-message bot';
                    plansLink.innerHTML = `
                        <div class="message-content">
                            <a href="pages/plans.html" class="chat-link">استعرض خطة حرق الدهون</a>
                        </div>
                    `;
                    chatMessages.appendChild(plansLink);
                    scrollToBottom();
                }, 1000);
            } else {
                addBotMessage('يمكنني مساعدتك في اختيار الخطة التدريبية المناسبة لك. هل تفضل خطة جاهزة أم خطة مخصصة بالكامل لاحتياجاتك؟');
                setTimeout(() => {
                    const plansLink = document.createElement('div');
                    plansLink.className = 'chat-message bot';
                    plansLink.innerHTML = `
                        <div class="message-content">
                            <a href="pages/plans.html" class="chat-link">استعرض جميع خطط التدريب</a>
                        </div>
                    `;
                    chatMessages.appendChild(plansLink);
                    scrollToBottom();
                }, 1000);
            }
        } else if (lowercaseMsg.includes('بروتين') || lowercaseMsg.includes('مكملات')) {
            addBotMessage('المكملات الغذائية مثل البروتين يمكن أن تساعدك في تحقيق أهدافك بشكل أسرع. لدينا مجموعة متنوعة من المكملات عالية الجودة تناسب احتياجاتك.');
            setTimeout(() => {
                const proteinLink = document.createElement('div');
                proteinLink.className = 'chat-message bot';
                proteinLink.innerHTML = `
                    <div class="message-content">
                        <a href="pages/protein.html" class="chat-link">استعرض منتجات البروتين والمكملات</a>
                    </div>
                `;
                chatMessages.appendChild(proteinLink);
                scrollToBottom();
            }, 1000);
        } else if (lowercaseMsg.includes('سعر') || lowercaseMsg.includes('تكلفة') || lowercaseMsg.includes('اشتراك')) {
            addBotMessage('تختلف أسعار خططنا التدريبية بناءً على نوع الخطة والمدة. الخطط تبدأ من ٨٠٠ جنيه شهرياً. يمكنك الاطلاع على التفاصيل الكاملة للأسعار في صفحة خطط التدريب.');
            setTimeout(() => {
                const subscriptionLink = document.createElement('div');
                subscriptionLink.className = 'chat-message bot';
                subscriptionLink.innerHTML = `
                    <div class="message-content">
                        <a href="pages/plans.html" class="chat-link">عرض تفاصيل الاشتراكات</a>
                    </div>
                `;
                chatMessages.appendChild(subscriptionLink);
                scrollToBottom();
            }, 1000);
        } else if (lowercaseMsg.includes('شكرا') || lowercaseMsg.includes('شكراً')) {
            addBotMessage('شكراً لك على تواصلك معنا! يسعدنا مساعدتك في تحقيق أهدافك. هل هناك أي استفسارات أخرى؟');
        } else {
            addBotMessage('شكراً على رسالتك. هل يمكنني مساعدتك في شيء محدد متعلق بالتدريب، أو البروتين، أو خطط التغذية؟');
        }
    }
    
    function sendChatUserNotification(userData) {
        // In a real application, this would be a server-side API call
        // Email notification about new chat user
        
        const emailContent = `
            مستخدم جديد بدأ محادثة:
            
            الاسم: ${userData.name}
            الهدف: ${userData.goal}
            المستوى: ${userData.level}
            الوقت: ${new Date().toLocaleString()}
        `;
        
        // Log the notification (for demo purposes)
        console.log('Sending new chat user notification to fahad4585a@gmail.com');
        console.log(emailContent);
        
        // Using EmailJS to send email (requires EmailJS script to be included)
        if (window.emailjs) {
            emailjs.send('default_service', 'chat_template', {
                to_email: 'fahad4585a@gmail.com',
                subject: 'مستخدم جديد للدردشة - جماوي',
                message: emailContent,
                from_name: userData.name || 'زائر الموقع'
            })
            .then(function(response) {
                console.log('Email sent successfully:', response);
            }, function(error) {
                console.error('Failed to send email:', error);
            });
        }
    }
    
    function sendChatMessageNotification(userData, message, type) {
        // Only send notifications for important interactions to avoid email flooding
        // In a real application, you'd aggregate messages and send periodic summaries
        
        // For this demo, we'll only send notifications for messages containing keywords about subscriptions
        const importantKeywords = ['اشتراك', 'خطة', 'سعر', 'تكلفة', 'برنامج'];
        const isImportant = importantKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (!isImportant && type === 'bot') return; // Only send important bot messages
        
        const emailContent = `
            رسالة ${type === 'user' ? 'من المستخدم' : 'الرد الآلي'}:
            
            الاسم: ${userData.name || 'غير معروف'}
            الهدف: ${userData.goal || 'غير محدد'}
            المستوى: ${userData.level || 'غير محدد'}
            الوقت: ${new Date().toLocaleString()}
            
            الرسالة:
            ${message}
        `;
        
        // Log the notification (for demo purposes)
        console.log(`Sending chat message notification to fahad4585a@gmail.com (${type})`);
        console.log(emailContent);
        
        // Using EmailJS to send email (requires EmailJS script to be included)
        if (window.emailjs) {
            emailjs.send('default_service', 'chat_template', {
                to_email: 'fahad4585a@gmail.com',
                subject: `رسالة دردشة ${type === 'user' ? 'من مستخدم' : 'آلية'} - جماوي`,
                message: emailContent,
                from_name: userData.name || 'زائر الموقع'
            })
            .then(function(response) {
                console.log('Email sent successfully:', response);
            }, function(error) {
                console.error('Failed to send email:', error);
            });
        }
    }
}); 