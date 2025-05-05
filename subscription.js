document.addEventListener('DOMContentLoaded', function() {
    // Subscription category switching
    const subCategories = document.querySelectorAll('.sub-category');
    const subPlans = document.querySelectorAll('.subscription-plans');
    
    if (subCategories.length > 0) {
        subCategories.forEach(category => {
            category.addEventListener('click', function() {
                // Remove active class from all categories
                subCategories.forEach(cat => cat.classList.remove('active'));
                
                // Add active class to clicked category
                this.classList.add('active');
                
                // Hide all plans
                subPlans.forEach(plan => plan.classList.remove('active-plans'));
                
                // Show selected plans
                const targetPlans = document.querySelector(`.${this.dataset.target}`);
                if (targetPlans) {
                    targetPlans.classList.add('active-plans');
                }
            });
        });
    }
    
    // Plan selection and form updating
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    const selectedPlanName = document.getElementById('selected-plan-name');
    const selectedPlanPrice = document.getElementById('selected-plan-price');
    
    if (subscribeBtns.length > 0) {
        subscribeBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Update selected plan info
                selectedPlanName.textContent = this.dataset.plan;
                selectedPlanPrice.textContent = this.dataset.price;
                
                // Highlight selected card
                document.querySelectorAll('.subscription-card').forEach(card => {
                    card.classList.remove('selected');
                });
                this.closest('.subscription-card').classList.add('selected');
                
                // Smooth scroll to form
                const formSection = document.getElementById('subscription-form');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // Form submission
    const subForm = document.querySelector('.subscription-form');
    
    if (subForm) {
        subForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const planName = selectedPlanName.textContent;
            
            if (planName === 'غير محدد') {
                alert('يرجى اختيار خطة اشتراك أولاً');
                return;
            }
            
            if (!name || !phone || !email) {
                alert('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            // Collect form data
            const formData = {
                name: name,
                phone: phone,
                email: email,
                age: document.getElementById('age').value,
                goal: document.getElementById('goal').value,
                plan: planName,
                price: selectedPlanPrice.textContent,
                payment: document.getElementById('payment').value,
                message: document.getElementById('message').value
            };
            
            // Store in localStorage for demo purposes
            localStorage.setItem('jamawi_subscription', JSON.stringify(formData));
            
            // Send email notification
            sendEmailNotification(formData);
            
            // Show success message
            showSuccessMessage();
        });
    }
    
    function showSuccessMessage() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>تم استلام طلب اشتراكك بنجاح!</h3>
            <p>سيتواصل معك أحد ممثلي خدمة العملاء قريباً لتأكيد الاشتراك وإتمام عملية الدفع.</p>
            <a href="../index.html" class="btn">العودة للصفحة الرئيسية</a>
        `;
        
        // Replace form with success message
        const formWrapper = document.querySelector('.form-wrapper');
        if (formWrapper) {
            formWrapper.innerHTML = '';
            formWrapper.appendChild(successMessage);
        }
        
        // Scroll to success message
        formWrapper.scrollIntoView({ behavior: 'smooth' });
    }
    
    function sendEmailNotification(formData) {
        // In a real application, this would be a server-side API call
        // For now, using EmailJS as a client-side solution
        // This assumes EmailJS is included in the page
        
        // Create email content
        const emailContent = `
            اشتراك جديد:
            
            الاسم: ${formData.name}
            رقم الهاتف: ${formData.phone}
            البريد الإلكتروني: ${formData.email}
            العمر: ${formData.age}
            الهدف: ${formData.goal}
            الخطة المختارة: ${formData.plan}
            السعر: ${formData.price} جنيه
            طريقة الدفع: ${formData.payment}
            ملاحظات: ${formData.message || 'لا توجد ملاحظات'}
        `;
        
        // Log the notification (for demo purposes)
        console.log('Sending email notification to fahad4585a@gmail.com');
        console.log(emailContent);
        
        // Using EmailJS to send email (requires EmailJS script to be included)
        // In production, you would use a backend API endpoint for this
        if (window.emailjs) {
            emailjs.send('default_service', 'subscription_template', {
                to_email: 'fahad4585a@gmail.com',
                subject: 'اشتراك جديد - جماوي',
                message: emailContent,
                from_name: formData.name,
                reply_to: formData.email
            })
            .then(function(response) {
                console.log('Email sent successfully:', response);
            }, function(error) {
                console.error('Failed to send email:', error);
            });
        }
    }
}); 