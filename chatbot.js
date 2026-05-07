/**
 * Advanced Chatbot for Unipulse College Finder
 * Powered by Google Gemini API
 */

class UnipulseChatbot {
    constructor() {
        this.config = CHATBOT_CONFIG;
        this.conversationHistory = [];
        this.isTyping = false;
        this.requestCount = 0;
        this.lastRequestTime = 0;
        this.collegeDatabase = this.loadCollegeDatabase();
        this.initializeElements();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    loadCollegeDatabase() {
        // Load college data if available
        if (typeof collegeData !== 'undefined') {
            console.log('✅ College database loaded successfully!');
            return collegeData;
        } else {
            console.warn('⚠️ College database not found, using fallback data');
            return null;
        }
    }

    initializeElements() {
        // Get chatbot elements
        this.chatbotToggle = document.getElementById('chatbot-toggle');
        this.chatbotWindow = document.getElementById('chatbot-window');
        this.chatbotClose = document.getElementById('chatbot-close');
        this.chatbotMessages = document.getElementById('chatbot-messages');
        this.chatbotInput = document.getElementById('chatbot-input');
        this.chatbotSend = document.getElementById('chatbot-send');
        this.typingIndicator = document.getElementById('typing-indicator');

        // Debug: Log which elements were found
        console.log('🔍 Chatbot Elements Check:');
        console.log('Toggle button:', this.chatbotToggle ? '✅ Found' : '❌ Not found');
        console.log('Chat window:', this.chatbotWindow ? '✅ Found' : '❌ Not found');
        console.log('Close button:', this.chatbotClose ? '✅ Found' : '❌ Not found');
        console.log('Messages area:', this.chatbotMessages ? '✅ Found' : '❌ Not found');
        console.log('Input field:', this.chatbotInput ? '✅ Found' : '❌ Not found');
        console.log('Send button:', this.chatbotSend ? '✅ Found' : '❌ Not found');

        // Validate critical elements
        if (!this.chatbotToggle || !this.chatbotWindow) {
            console.error('❌ Critical chatbot elements not found!');
            throw new Error('Chatbot elements missing');
        }

        // Ensure toggle button is visible
        if (this.chatbotToggle) {
            this.chatbotToggle.style.display = 'flex';
            console.log('✅ Chatbot toggle button made visible');
        }

        console.log('✅ Chatbot elements initialized successfully!');
        
        // Add initial system message
        setTimeout(() => {
            this.addMessage('🤖 **Unipulse AI Assistant Ready!**\n\nI can help you with personalized college guidance. Try:\n• "I got 85 percentile in JEE Main"\n• "Tell me about COEP college"\n• "Best colleges for Computer Science"', 'bot');
        }, 1000);
    }

    setupEventListeners() {
        // Toggle chatbot window
        this.chatbotToggle?.addEventListener('click', () => this.toggleChatbot());
        this.chatbotClose?.addEventListener('click', () => this.closeChatbot());

        // Send message events
        this.chatbotSend?.addEventListener('click', () => this.sendMessage());
        this.chatbotInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize input
        this.chatbotInput?.addEventListener('input', () => this.autoResizeInput());
        
        console.log('✅ Event listeners setup complete!');
    }

    toggleChatbot() {
        const isVisible = this.chatbotWindow.style.display === 'flex';
        this.chatbotWindow.style.display = isVisible ? 'none' : 'flex';
        
        if (!isVisible) {
            this.chatbotInput?.focus();
        }
    }

    closeChatbot() {
        this.chatbotWindow.style.display = 'none';
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage(this.config.DEFAULT_RESPONSES.WELCOME, 'bot');
        }, 500);
    }

    async sendMessage() {
        const message = this.chatbotInput?.value.trim();
        if (!message || this.isTyping) return;

        // Check rate limiting
        if (!this.checkRateLimit()) {
            this.addMessage("Please wait a moment before sending another message.", 'bot');
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        this.chatbotInput.value = '';
        this.autoResizeInput();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.getGeminiResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTypingIndicator();
            this.addMessage(this.config.DEFAULT_RESPONSES.ERROR, 'bot');
        }
    }

    async getGeminiResponse(userMessage) {
        // Check if API key is configured
        if (!this.config.API_KEY || this.config.API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            return this.getFallbackResponse(userMessage);
        }

        try {
            // Prepare conversation context
            const context = this.buildConversationContext(userMessage);
            
            // Make API request to Gemini
            const response = await fetch(`${this.config.API_URL}?key=${this.config.API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: context
                        }]
                    }],
                    generationConfig: {
                        temperature: this.config.TEMPERATURE,
                        maxOutputTokens: this.config.MAX_TOKENS,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                
                // Store in conversation history
                this.conversationHistory.push({
                    user: userMessage,
                    bot: aiResponse,
                    timestamp: new Date()
                });

                return aiResponse;
            } else {
                throw new Error('Invalid response format from Gemini API');
            }

        } catch (error) {
            console.error('Gemini API error:', error);
            // Fall back to local responses
            return this.getFallbackResponse(userMessage);
        }
    }

    buildConversationContext(userMessage) {
        let context = this.config.SYSTEM_CONTEXT + "\n\n";
        
        // Add recent conversation history for context
        const recentHistory = this.conversationHistory.slice(-3);
        if (recentHistory.length > 0) {
            context += "Recent conversation:\n";
            recentHistory.forEach(exchange => {
                context += `User: ${exchange.user}\nAssistant: ${exchange.bot}\n\n`;
            });
        }
        
        context += `Current user message: ${userMessage}\n\nPlease provide a helpful response:`;
        
        return context;
    }

    getFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Extract numbers from message (marks, percentile, rank)
        const numbers = message.match(/\d+/g);
        const hasNumbers = numbers && numbers.length > 0;
        
        // Check for specific college name queries first
        const collegeInfo = this.searchCollegeByName(message);
        if (collegeInfo) {
            return collegeInfo;
        }
        
        // Handle general questions
        if (this.isGeneralQuestion(message)) {
            return this.getGeneralResponse(message, userMessage);
        }
        
        // Check for marks/percentile/rank queries
        if (hasNumbers && (message.includes('marks') || message.includes('percentile') || message.includes('score') || message.includes('rank'))) {
            return this.analyzeMarksAndSuggestColleges(numbers, message);
        }
        
        // Enhanced college-specific responses
        const collegeResponses = {
            coep: "🏛️ **COEP (College of Engineering, Pune)**\n\n📊 **Cutoffs 2024:**\n• Computer Science: 150-500 ranks\n• IT: 300-800 ranks\n• Mechanical: 800-1500 ranks\n• Civil: 1200-2000 ranks\n\n💰 **Fees:** ₹1.2L per year\n📈 **Placements:** 6-40 LPA (Average: 12 LPA)\n🏢 **Top Recruiters:** Microsoft, Google, Tata, L&T\n\nWould you like admission procedure details?",
            
            vnit: "🏛️ **VNIT Nagpur (NIT)**\n\n📊 **Cutoffs 2024:**\n• Computer Science: 100-400 ranks\n• IT: 300-700 ranks\n• Mechanical: 500-1200 ranks\n• Electrical: 600-1300 ranks\n\n💰 **Fees:** ₹1.5L per year\n📈 **Placements:** 8-45 LPA (Average: 15 LPA)\n🏢 **Top Recruiters:** Amazon, Flipkart, TCS, Infosys\n\nNeed specific branch information?",
            
            ict: "🏛️ **ICT Mumbai (Institute of Chemical Technology)**\n\n📊 **Cutoffs 2024:**\n• Chemical Engineering: 200-600 ranks\n• Pharmacy: 300-800 ranks\n• Food Technology: 500-1000 ranks\n\n💰 **Fees:** ₹1.8L per year\n📈 **Placements:** 10-50 LPA (Average: 18 LPA)\n🏢 **Industries:** Pharma, Chemical, Food Processing\n\nInterested in specific programs?",
            
            pict: "🏛️ **PICT Pune**\n\n📊 **Cutoffs 2024:**\n• Computer Science: 2000-4000 ranks\n• IT: 2500-5000 ranks\n• Electronics: 3000-6000 ranks\n\n💰 **Fees:** ₹2.5L per year\n📈 **Placements:** 4-25 LPA (Average: 8 LPA)\n🏢 **Recruiters:** Infosys, Wipro, Capgemini, Accenture",
            
            vit: "🏛️ **VIT Pune**\n\n📊 **Cutoffs 2024:**\n• Computer Science: 3000-7000 ranks\n• IT: 4000-8000 ranks\n• Mechanical: 5000-10000 ranks\n\n💰 **Fees:** ₹3L per year\n📈 **Placements:** 3.5-20 LPA (Average: 6.5 LPA)\n🏢 **Focus:** Industry partnerships, practical learning"
        };
        
        // Check for college names
        for (const [college, response] of Object.entries(collegeResponses)) {
            if (message.includes(college)) {
                return response;
            }
        }
        
        // Topic-based intelligent responses
        const topicResponses = {
            cutoff: "📊 **Maharashtra College Cutoffs 2024**\n\n🏆 **Top Engineering Colleges:**\n• COEP: 150-2000 ranks\n• VNIT: 100-1500 ranks\n• ICT Mumbai: 200-1500 ranks\n• PICT: 2000-8000 ranks\n• VIT Pune: 3000-12000 ranks\n\n🏥 **Medical Colleges (NEET):**\n• Govt colleges: 600+ marks\n• Private colleges: 450-550 marks\n\n💊 **Pharmacy (MHT-CET):**\n• ICT Mumbai: Top 500 ranks\n• Govt colleges: 500-2000 ranks\n\nTell me your marks for personalized suggestions!",
            
            fees: "💰 **Fee Structure 2024-25**\n\n🔧 **Engineering:**\n• Government: ₹80,000-1.5L/year\n• Private: ₹2-4L/year\n• Autonomous: ₹1.5-2.5L/year\n\n🏥 **Medical:**\n• Government: ₹50,000-1L/year\n• Private: ₹8-25L/year\n\n💊 **Pharmacy:**\n• Government: ₹60,000-1.2L/year\n• Private: ₹1.5-3L/year\n\n📚 Additional costs: Hostel (₹50K-1L), Books (₹20K-30K)\n\nNeed specific college fee details?",
            
            medical: "🏥 **Top Medical Colleges in Maharashtra**\n\n🏆 **Government Colleges:**\n• Grant Medical College, Mumbai (Est. 1845)\n• B.J. Medical College, Pune (Est. 1878)\n• Govt Medical College, Nagpur\n• Govt Medical College, Aurangabad\n\n📊 **NEET Requirements:**\n• General: 600+ marks\n• OBC: 550+ marks\n• SC/ST: 500+ marks\n\n💰 **Fees:** Govt (₹50K-1L), Private (₹8-25L)\n\nWhat's your NEET score?",
            
            pharmacy: "💊 **Pharmacy Colleges in Maharashtra**\n\n🏆 **Top Colleges:**\n• ICT Mumbai (Rank 1-500)\n• Govt College of Pharmacy, Karad\n• Poona College of Pharmacy, Pune\n• AISSMS College of Pharmacy, Pune\n\n📊 **MHT-CET Requirements:**\n• ICT Mumbai: Top 500 ranks\n• Govt colleges: 500-2000 ranks\n• Private colleges: 2000-8000 ranks\n\n💼 **Career Options:** Pharma industry, Research, Hospital pharmacy, Drug inspector\n\nInterested in B.Pharm or M.Pharm?",
            
            engineering: "🔧 **Engineering in Maharashtra**\n\n🏆 **Top Branches by Placement:**\n• Computer Science: 6-40 LPA\n• IT: 5-35 LPA\n• Electronics: 4-25 LPA\n• Mechanical: 3.5-20 LPA\n• Civil: 3-15 LPA\n\n📊 **Admission Process:**\n• JEE Main (All India)\n• MHT-CET (State quota)\n• Direct admission (Management quota)\n\n🏛️ **College Categories:**\n• Government (Best ROI)\n• Autonomous (Good facilities)\n• Private (Easy admission)\n\nWhat's your preferred branch?",
            
            admission: "📋 **Admission Process 2024**\n\n🔧 **Engineering:**\n• JEE Main: April & May\n• MHT-CET: May\n• Counseling: June-August\n\n🏥 **Medical:**\n• NEET: May\n• State counseling: July-September\n\n💊 **Pharmacy:**\n• MHT-CET: May\n• CAP rounds: June-August\n\n📅 **Important Dates:**\n• Application: March-April\n• Results: May-June\n• Counseling: June-August\n\nNeed specific exam preparation tips?",
            
            placement: "📈 **Placement Statistics 2024**\n\n🏆 **Top Performing Colleges:**\n• VNIT Nagpur: 95% placement, 15 LPA avg\n• COEP Pune: 92% placement, 12 LPA avg\n• ICT Mumbai: 98% placement, 18 LPA avg\n• PICT Pune: 85% placement, 8 LPA avg\n\n🏢 **Top Recruiters:**\n• IT: Microsoft, Google, Amazon, Infosys\n• Core: Tata, L&T, Bajaj, Mahindra\n• Consulting: Deloitte, EY, KPMG\n\n💡 **Placement Tips:**\n• Maintain 8+ CGPA\n• Learn relevant skills\n• Participate in competitions\n\nWhich field interests you most?",
            
            mumbai: "🏙️ **Mumbai - Education Hub**\n\n🏛️ **Top Colleges:**\n• ICT Mumbai (Chemical/Pharmacy)\n• VJTI (Engineering)\n• Grant Medical College (Medical)\n• Sydenham College (Commerce)\n\n💰 **Living Costs:**\n• Hostel: ₹80K-1.5L/year\n• PG/Sharing: ₹15K-25K/month\n• Food: ₹8K-12K/month\n\n🚇 **Advantages:**\n• Industry exposure\n• Internship opportunities\n• Cultural diversity\n• Job prospects\n\nLooking for specific courses in Mumbai?",
            
            pune: "🏛️ **Pune - Student City**\n\n🎓 **Top Colleges:**\n• COEP (Engineering)\n• PICT (Engineering)\n• VIT (Engineering)\n• B.J. Medical College (Medical)\n\n💰 **Living Costs:**\n• Hostel: ₹60K-1L/year\n• PG: ₹8K-15K/month\n• Food: ₹6K-10K/month\n\n🌟 **Student Life:**\n• Affordable living\n• Great weather\n• IT hub proximity\n• Cultural activities\n\nWhich colleges are you considering in Pune?"
        };

        
        // Check for topic keywords
        for (const [keyword, response] of Object.entries(topicResponses)) {
            if (message.includes(keyword)) {
                return response;
            }
        }
        
        // Branch-specific queries
        if (message.includes('computer science') || message.includes('cs') || message.includes('cse')) {
            return "💻 **Computer Science Engineering**\n\n🏆 **Top Colleges & Cutoffs:**\n• VNIT Nagpur: 100-400 ranks\n• COEP Pune: 150-500 ranks\n• ICT Mumbai: Not available\n• PICT Pune: 2000-4000 ranks\n\n📈 **Career Prospects:**\n• Software Developer: 4-40 LPA\n• Data Scientist: 6-50 LPA\n• Product Manager: 8-60 LPA\n\n🔥 **Hot Skills:** AI/ML, Cloud Computing, Blockchain\n\nWhat's your rank/percentile?";
        }
        
        if (message.includes('mechanical') || message.includes('mech')) {
            return "⚙️ **Mechanical Engineering**\n\n🏆 **Top Colleges & Cutoffs:**\n• VNIT Nagpur: 500-1200 ranks\n• COEP Pune: 800-1500 ranks\n• PICT Pune: 3000-6000 ranks\n\n📈 **Career Prospects:**\n• Design Engineer: 3.5-15 LPA\n• Manufacturing: 4-20 LPA\n• Automotive: 5-25 LPA\n\n🏭 **Top Recruiters:** Tata Motors, Bajaj, L&T, Mahindra\n\nInterested in core or software roles?";
        }
        
        // Help and guidance
        if (message.includes('help') || message.includes('guide') || message.includes('how')) {
            return "🤖 **I can help you with:**\n\n📊 **Personalized Guidance:**\n• Share your marks → Get college suggestions\n• College comparisons & rankings\n• Cut-off analysis & predictions\n\n📚 **Information Services:**\n• Admission procedures & deadlines\n• Fee structures & scholarships\n• Placement statistics & career guidance\n• Branch-wise details & scope\n\n💡 **Quick Examples:**\n• \"I got 85 percentile in JEE Main\"\n• \"Tell me about COEP fees\"\n• \"Best colleges for Computer Science\"\n\nWhat would you like to know?";
        }
        
        // Default intelligent responses
        const smartDefaults = [
            "🎯 I'm here to help you find the perfect college! You can ask me about:\n\n• **Your chances:** Share your marks/percentile\n• **College details:** Fees, cutoffs, placements\n• **Comparisons:** Which college is better?\n• **Guidance:** Admission process, career advice\n\nWhat specific information do you need?",
            
            "📚 **Welcome to Unipulse College Guidance!**\n\nI have detailed information about 1000+ Maharashtra colleges. I can help with:\n\n✅ Personalized college suggestions based on your marks\n✅ Detailed college comparisons\n✅ Admission procedures & important dates\n✅ Career guidance & placement statistics\n\nTry asking: \"I scored 90 percentile in JEE Main, suggest colleges\"",
            
            "🔍 **Let me help you make the right choice!**\n\nI specialize in Maharashtra college admissions and can provide:\n\n📊 Cut-off analysis for your marks\n🏛️ College recommendations based on preferences\n💰 Fee comparisons & scholarship information\n📈 Placement statistics & career prospects\n\nShare your exam scores or ask about specific colleges!"
        ];
        
        return smartDefaults[Math.floor(Math.random() * smartDefaults.length)];
    }
    
    // Check if the question is a general knowledge question
    isGeneralQuestion(message) {
        const generalKeywords = [
            'what is', 'who is', 'how to', 'why', 'when', 'where', 'explain', 'define',
            'meaning', 'difference', 'compare', 'history', 'science', 'math', 'technology',
            'programming', 'computer', 'software', 'hardware', 'internet', 'ai', 'artificial intelligence',
            'machine learning', 'data science', 'python', 'java', 'javascript', 'coding',
            'weather', 'news', 'sports', 'health', 'food', 'travel', 'business', 'economics',
            'politics', 'geography', 'biology', 'chemistry', 'physics', 'literature', 'art',
            'music', 'movie', 'book', 'game', 'recipe', 'exercise', 'fitness', 'medicine'
        ];
        
        return generalKeywords.some(keyword => message.includes(keyword)) ||
               message.includes('?') ||
               message.split(' ').length > 3; // Longer questions are likely general
    }
    
    // Provide responses to general questions
    getGeneralResponse(message, originalMessage) {
        // Technology and Programming
        if (message.includes('programming') || message.includes('coding') || message.includes('software')) {
            return "💻 **Programming & Technology**\n\nI can help you with programming concepts, languages, and career guidance!\n\n🔹 **Popular Languages:** Python, Java, JavaScript, C++, C#\n🔹 **Career Paths:** Software Developer, Data Scientist, Web Developer, AI Engineer\n🔹 **Learning Resources:** Online courses, coding bootcamps, practice platforms\n\nWhat specific programming topic would you like to know about?";
        }
        
        if (message.includes('python')) {
            return "🐍 **Python Programming**\n\nPython is one of the most popular programming languages!\n\n✅ **Uses:**\n• Web Development (Django, Flask)\n• Data Science & AI (Pandas, NumPy, TensorFlow)\n• Automation & Scripting\n• Game Development\n\n📚 **Learning Path:**\n1. Basic syntax and data types\n2. Control structures (loops, conditions)\n3. Functions and modules\n4. Object-oriented programming\n5. Libraries and frameworks\n\nWant specific Python learning resources?";
        }
        
        if (message.includes('javascript') || message.includes('js')) {
            return "⚡ **JavaScript**\n\nJavaScript powers the modern web!\n\n🌐 **Uses:**\n• Frontend Development (React, Vue, Angular)\n• Backend Development (Node.js)\n• Mobile Apps (React Native)\n• Desktop Apps (Electron)\n\n📈 **Career Opportunities:**\n• Frontend Developer: 4-15 LPA\n• Full-stack Developer: 6-25 LPA\n• React Developer: 5-20 LPA\n\nInterested in web development career path?";
        }
        
        // Science and Mathematics
        if (message.includes('math') || message.includes('mathematics')) {
            return "🔢 **Mathematics**\n\nMath is the foundation of science and technology!\n\n📐 **Key Areas:**\n• Algebra & Calculus\n• Statistics & Probability\n• Discrete Mathematics\n• Linear Algebra\n• Data Analysis\n\n💼 **Career Applications:**\n• Data Science & Analytics\n• Engineering & Technology\n• Finance & Economics\n• Research & Academia\n\nWhat specific math topic interests you?";
        }
        
        if (message.includes('science') || message.includes('physics') || message.includes('chemistry') || message.includes('biology')) {
            return "🔬 **Science & Research**\n\nScience opens doors to amazing careers!\n\n🧪 **Major Fields:**\n• Physics: Study of matter and energy\n• Chemistry: Study of substances and reactions\n• Biology: Study of living organisms\n• Environmental Science: Study of ecosystems\n\n🎓 **Career Paths:**\n• Research Scientist\n• Laboratory Technician\n• Science Teacher/Professor\n• Biotechnology Engineer\n• Environmental Consultant\n\nWhich science field interests you most?";
        }
        
        // Health and Fitness
        if (message.includes('health') || message.includes('fitness') || message.includes('exercise')) {
            return "💪 **Health & Fitness**\n\nGreat question about staying healthy!\n\n🏃‍♂️ **Fitness Tips:**\n• Regular exercise (30 min daily)\n• Balanced diet with fruits & vegetables\n• Adequate sleep (7-8 hours)\n• Stay hydrated (8-10 glasses water)\n• Manage stress through meditation\n\n🥗 **Healthy Habits:**\n• Avoid processed foods\n• Include protein in every meal\n• Take breaks from screen time\n• Practice good posture\n\nNeed specific fitness or nutrition advice?";
        }
        
        // Technology and AI
        if (message.includes('ai') || message.includes('artificial intelligence') || message.includes('machine learning')) {
            return "🤖 **Artificial Intelligence & Machine Learning**\n\nAI is transforming every industry!\n\n🧠 **Key Concepts:**\n• Machine Learning: Algorithms that learn from data\n• Deep Learning: Neural networks for complex patterns\n• Natural Language Processing: Understanding human language\n• Computer Vision: Analyzing images and videos\n\n💼 **Career Opportunities:**\n• AI Engineer: 8-30 LPA\n• Data Scientist: 6-25 LPA\n• ML Engineer: 10-35 LPA\n• Research Scientist: 12-50 LPA\n\nInterested in AI career path or learning resources?";
        }
        
        // Business and Economics
        if (message.includes('business') || message.includes('economics') || message.includes('finance')) {
            return "💼 **Business & Economics**\n\nBusiness knowledge is valuable in any career!\n\n📊 **Key Areas:**\n• Marketing & Sales\n• Finance & Accounting\n• Operations Management\n• Entrepreneurship\n• Digital Marketing\n\n💰 **Career Paths:**\n• Business Analyst: 4-15 LPA\n• Marketing Manager: 6-20 LPA\n• Financial Analyst: 5-18 LPA\n• Product Manager: 8-30 LPA\n\nWhat aspect of business interests you?";
        }
        
        // General how-to questions
        if (message.includes('how to')) {
            return "🎯 **How-To Guide**\n\nI'd be happy to help you learn something new!\n\n📚 **I can help with:**\n• Study techniques and time management\n• Career planning and skill development\n• Technology and programming concepts\n• College admission strategies\n• Interview preparation tips\n• Personal development advice\n\n💡 **Popular Topics:**\n• How to choose the right career\n• How to prepare for competitive exams\n• How to learn programming effectively\n• How to improve communication skills\n\nWhat specific skill would you like to develop?";
        }
        
        // What is questions
        if (message.includes('what is')) {
            return "🤔 **Knowledge & Information**\n\nI can explain concepts from various fields!\n\n📖 **Topics I cover:**\n• Technology & Programming\n• Science & Mathematics\n• Career & Education\n• Health & Lifestyle\n• Business & Economics\n• Current trends & innovations\n\n💭 **Example Questions:**\n• What is machine learning?\n• What is the best career for me?\n• What is the difference between AI and ML?\n• What is data science?\n\nFeel free to ask about any topic - I'll provide clear, helpful explanations!";
        }
        
        // Default response for general questions
        return "🤖 **Unipulse AI Assistant**\n\nI'm here to help with ANY question you have!\n\n✨ **I can assist with:**\n• 🎓 **Education:** College guidance, career planning, study tips\n• 💻 **Technology:** Programming, AI, software development\n• 🔬 **Science:** Physics, chemistry, biology, mathematics\n• 💼 **Career:** Job advice, skill development, interview prep\n• 🏥 **Health:** Fitness tips, wellness advice\n• 📚 **General Knowledge:** History, geography, current events\n\n💡 **Just ask me anything!** Examples:\n• \"What is machine learning?\"\n• \"How to prepare for JEE?\"\n• \"Best programming language to learn?\"\n• \"Career options after engineering?\"\n\nWhat would you like to know?";
    }

    // Search for college information by name
    searchCollegeByName(message) {
        if (!this.collegeDatabase) return null;

        // Common college name variations and keywords
        const collegeKeywords = {
            'coep': ['coep', 'college of engineering pune', 'pune engineering'],
            'vnit': ['vnit', 'visvesvaraya national institute', 'nagpur nit'],
            'pict': ['pict', 'pune institute computer technology'],
            'vit pune': ['vit pune', 'vishwakarma institute technology'],
            'ict mumbai': ['ict mumbai', 'institute chemical technology'],
            'vjti': ['vjti', 'veermata jijabai technological institute'],
            'spit': ['spit', 'sardar patel institute technology'],
            'mit pune': ['mit pune', 'maharashtra institute technology'],
            'walchand': ['walchand', 'walchand college engineering sangli'],
            'government college aurangabad': ['geca', 'government college engineering aurangabad'],
            'government college nagpur': ['gecn', 'government college engineering nagpur']
        };

        // Search through all categories
        const allColleges = [
            ...(this.collegeDatabase.engineering || []),
            ...(this.collegeDatabase.medical || []),
            ...(this.collegeDatabase.pharmacy || [])
        ];

        // Find matching college
        let foundCollege = null;
        
        // First try exact name matching
        foundCollege = allColleges.find(college => 
            message.includes(college.name.toLowerCase())
        );

        // If not found, try keyword matching
        if (!foundCollege) {
            for (const [key, keywords] of Object.entries(collegeKeywords)) {
                if (keywords.some(keyword => message.includes(keyword))) {
                    foundCollege = allColleges.find(college => 
                        college.name.toLowerCase().includes(key.replace(' ', '')) ||
                        keywords.some(k => college.name.toLowerCase().includes(k))
                    );
                    break;
                }
            }
        }

        if (foundCollege) {
            return this.formatCollegeInfo(foundCollege);
        }

        return null;
    }

    // Format college information for display
    formatCollegeInfo(college) {
        let response = `🏛️ **${college.name}**\n\n`;
        response += `📍 **Location:** ${college.district}, Maharashtra\n`;
        response += `🏢 **Type:** ${college.type}\n`;
        response += `📅 **Established:** ${college.established}\n`;
        response += `⭐ **Rating:** ${college.rating}/5\n`;
        response += `💰 **Fees:** ${college.fees}\n\n`;

        if (college.branches && college.branches.length > 0) {
            response += `🎓 **Available Branches:**\n`;
            college.branches.forEach(branch => {
                response += `• ${branch}\n`;
            });
            response += `\n`;
        }

        if (college.cutoffRanks) {
            response += `📊 **Cutoff Ranks (General Category):**\n`;
            Object.entries(college.cutoffRanks).forEach(([branch, ranks]) => {
                response += `• ${branch}: ${ranks.General} rank\n`;
            });
            response += `\n`;
        }

        if (college.cutoffMarks) {
            response += `📈 **Cutoff Marks (General Category):**\n`;
            Object.entries(college.cutoffMarks).forEach(([branch, marks]) => {
                response += `• ${branch}: ${marks.General} marks\n`;
            });
            response += `\n`;
        }

        response += `💡 **Want to know your chances?** Share your marks/percentile!\n`;
        response += `🔍 **Need more details?** Ask about specific branches or admission process.`;

        return response;
    }

    // Enhanced marks-based college suggestions using database
    analyzeMarksAndSuggestColleges(numbers, message) {
        const score = Math.max(...numbers.map(Number));
        
        if (message.includes('jee') || message.includes('percentile')) {
            return this.getJEECollegeSuggestionsFromDB(score);
        } else if (message.includes('neet')) {
            return this.getNEETCollegeSuggestionsFromDB(score);
        } else if (message.includes('mht') || message.includes('cet')) {
            return this.getMHTCETCollegeSuggestionsFromDB(score);
        } else {
            // General marks analysis
            return `📊 **Score Analysis: ${score}**\n\nTo provide accurate college suggestions, please specify:\n\n🔹 **JEE Main Percentile:** For engineering colleges\n🔹 **NEET Score:** For medical colleges\n🔹 **MHT-CET Percentile:** For state quota\n🔹 **12th Percentage:** For direct admissions\n\nExample: \"I got 85 percentile in JEE Main\"\n\nWhich exam did you appear for?`;
        }
    }

    // JEE-based suggestions using database
    getJEECollegeSuggestionsFromDB(percentile) {
        if (!this.collegeDatabase || !this.collegeDatabase.engineering) {
            return this.getJEECollegeSuggestions(percentile); // Fallback to original method
        }

        const engineeringColleges = this.collegeDatabase.engineering;
        const estimatedRank = this.percentileToRank(percentile);
        
        let response = `🎉 **JEE Main Analysis: ${percentile} Percentile (≈${estimatedRank} rank)**\n\n`;
        
        // Find suitable colleges based on rank
        const suitableColleges = [];
        const backupColleges = [];
        
        engineeringColleges.forEach(college => {
            if (college.cutoffRanks) {
                const csRank = college.cutoffRanks["Computer Science"]?.General;
                const itRank = college.cutoffRanks["Information Technology"]?.General;
                const minRank = Math.min(csRank || Infinity, itRank || Infinity);
                
                if (estimatedRank <= minRank) {
                    suitableColleges.push({...college, minRank});
                } else if (estimatedRank <= minRank * 1.5) {
                    backupColleges.push({...college, minRank});
                }
            }
        });

        // Sort by rank (better colleges first)
        suitableColleges.sort((a, b) => a.minRank - b.minRank);
        backupColleges.sort((a, b) => a.minRank - b.minRank);

        if (suitableColleges.length > 0) {
            response += `🏆 **Top Colleges for You:**\n`;
            suitableColleges.slice(0, 5).forEach((college, index) => {
                response += `${index + 1}. **${college.name}**\n`;
                response += `   📍 ${college.district} | 💰 ${college.fees} | ⭐ ${college.rating}/5\n`;
                response += `   🎯 CS Cutoff: ${college.cutoffRanks["Computer Science"]?.General || 'N/A'} rank\n\n`;
            });
        }

        if (backupColleges.length > 0) {
            response += `🎯 **Backup Options:**\n`;
            backupColleges.slice(0, 3).forEach((college, index) => {
                response += `${index + 1}. **${college.name}** (${college.district})\n`;
            });
            response += `\n`;
        }

        response += `💡 **Next Steps:**\n`;
        response += `• Register for JoSAA counseling\n`;
        response += `• Apply for MHT-CET as backup\n`;
        response += `• Prepare required documents\n\n`;
        response += `🔍 **Want details about any college?** Just ask: "Tell me about COEP"`;

        return response;
    }

    // Convert percentile to approximate rank
    percentileToRank(percentile) {
        // Approximate conversion based on JEE Main statistics
        const totalCandidates = 1200000; // Approximate JEE Main candidates
        const rank = Math.round((100 - percentile) * totalCandidates / 100);
        return Math.max(1, rank);
    }

    // NEET-based suggestions using database
    getNEETCollegeSuggestionsFromDB(score) {
        if (!this.collegeDatabase || !this.collegeDatabase.medical) {
            return this.getNEETCollegeSuggestions(score); // Fallback to original method
        }

        const medicalColleges = this.collegeDatabase.medical;
        
        let response = `🏥 **NEET Analysis: ${score} Marks**\n\n`;
        
        // Find suitable colleges based on marks
        const suitableColleges = [];
        
        medicalColleges.forEach(college => {
            if (college.cutoffMarks) {
                const generalCutoff = college.cutoffMarks.General || college.cutoffMarks["MBBS"]?.General;
                if (score >= generalCutoff - 20) { // 20 marks buffer
                    suitableColleges.push({...college, cutoff: generalCutoff});
                }
            }
        });

        // Sort by cutoff (easier colleges first for lower scores)
        suitableColleges.sort((a, b) => a.cutoff - b.cutoff);

        if (suitableColleges.length > 0) {
            response += `🏆 **Medical Colleges for You:**\n`;
            suitableColleges.slice(0, 5).forEach((college, index) => {
                response += `${index + 1}. **${college.name}**\n`;
                response += `   📍 ${college.district} | 💰 ${college.fees} | ⭐ ${college.rating}/5\n`;
                response += `   🎯 Cutoff: ${college.cutoff} marks\n\n`;
            });
        } else {
            response += `💡 **Alternative Options:**\n`;
            response += `• Private medical colleges (Management quota)\n`;
            response += `• AYUSH courses (BAMS, BHMS, BUMS)\n`;
            response += `• Paramedical courses\n`;
            response += `• BDS (Dental) colleges\n\n`;
        }

        response += `📅 **Next Steps:**\n`;
        response += `• Register for NEET counseling\n`;
        response += `• Prepare required documents\n`;
        response += `• Consider state quota options\n\n`;
        response += `🔍 **Want details about any college?** Just ask!`;

        return response;
    }

    // MHT-CET based suggestions using database
    getMHTCETCollegeSuggestionsFromDB(percentile) {
        if (!this.collegeDatabase || !this.collegeDatabase.engineering) {
            return this.getMHTCETCollegeSuggestions(percentile); // Fallback to original method
        }

        const engineeringColleges = this.collegeDatabase.engineering;
        const estimatedRank = this.percentileToRank(percentile);
        
        let response = `🎯 **MHT-CET Analysis: ${percentile} Percentile (≈${estimatedRank} rank)**\n\n`;
        
        // Focus on government and autonomous colleges for MHT-CET
        const governmentColleges = engineeringColleges.filter(college => 
            college.type === "Government" || college.type === "Autonomous"
        );
        
        const suitableColleges = [];
        
        governmentColleges.forEach(college => {
            if (college.cutoffRanks) {
                const csRank = college.cutoffRanks["Computer Science"]?.General;
                if (csRank && estimatedRank <= csRank * 1.2) { // 20% buffer
                    suitableColleges.push({...college, csRank});
                }
            }
        });

        suitableColleges.sort((a, b) => a.csRank - b.csRank);

        if (suitableColleges.length > 0) {
            response += `🏛️ **Government/Autonomous Colleges:**\n`;
            suitableColleges.slice(0, 5).forEach((college, index) => {
                response += `${index + 1}. **${college.name}**\n`;
                response += `   📍 ${college.district} | 💰 ${college.fees}\n`;
                response += `   🎯 CS Cutoff: ${college.csRank} rank\n\n`;
            });
        }

        response += `💡 **MHT-CET Advantages:**\n`;
        response += `• 85% state quota reservation\n`;
        response += `• Lower fees in government colleges\n`;
        response += `• Home state advantage\n\n`;
        response += `🔍 **Want details about any college?** Just ask!`;

        return response;
    }

    getJEECollegeSuggestions(percentile) {
        if (percentile >= 95) {
            return `🎉 **Excellent Score: ${percentile} Percentile!**\n\n🏆 **Top Choices for You:**\n• VNIT Nagpur - CS/IT (Almost Guaranteed)\n• COEP Pune - CS/IT (High chances)\n• ICT Mumbai - Chemical Engineering\n• NIT Goa/Bhopal - CS/IT (Backup)\n\n💡 **Strategy:**\n• Apply for top NITs in other states\n• Consider IIIT Pune for CS\n• Keep PICT as safety option\n\n📅 **Next Steps:**\n1. Register for JoSAA counseling\n2. Prepare documents\n3. Research branch preferences\n\nNeed specific college details?`;
        } else if (percentile >= 90) {
            return `🌟 **Great Score: ${percentile} Percentile!**\n\n🎯 **Recommended Colleges:**\n• COEP Pune - Mechanical/Civil (Good chances)\n• VNIT Nagpur - Mechanical/Civil/Electrical\n• PICT Pune - CS/IT (High chances)\n• VIT Pune - CS/IT (Safe option)\n\n💰 **Fee Comparison:**\n• COEP: ₹1.2L/year (Best ROI)\n• PICT: ₹2.5L/year (Good placements)\n• VIT: ₹3L/year (Decent option)\n\n🎯 **Focus Areas:**\n• Prepare for MHT-CET as backup\n• Research branch vs college priority\n\nWhich branch interests you most?`;
        } else if (percentile >= 80) {
            return `📈 **Good Score: ${percentile} Percentile!**\n\n🏛️ **Suitable Options:**\n• PICT Pune - IT/Electronics (Moderate chances)\n• VIT Pune - CS/IT (Good chances)\n• MIT Pune - All branches\n• AISSMS Pune - CS/IT\n\n💡 **Smart Strategy:**\n• Focus on MHT-CET for better state options\n• Consider branch flexibility\n• Look at autonomous colleges\n\n📊 **Expected Packages:**\n• CS/IT: 4-15 LPA\n• Electronics: 3.5-12 LPA\n• Mechanical: 3-10 LPA\n\nNeed MHT-CET preparation tips?`;
        } else if (percentile >= 70) {
            return `💪 **Decent Score: ${percentile} Percentile!**\n\n🎯 **Realistic Options:**\n• VIT Pune - Electronics/Mechanical\n• MIT Pune - All branches (Good chances)\n• AISSMS Pune - IT/Computer\n• Private colleges with good placements\n\n🔥 **Improvement Strategy:**\n• **MHT-CET Focus:** Can get better colleges\n• **Management Quota:** Consider top colleges\n• **Branch Choice:** Prioritize placement-oriented branches\n\n💰 **Budget Planning:**\n• Government: ₹1-1.5L (via MHT-CET)\n• Private: ₹2-4L (Direct admission)\n\nShall I suggest MHT-CET preparation strategy?`;
        } else {
            return `🎯 **Score: ${percentile} Percentile**\n\n💡 **Don't worry! You have options:**\n\n🔄 **Immediate Actions:**\n• **MHT-CET Preparation:** Your best bet for good colleges\n• **Management Quota:** Consider top private colleges\n• **Gap Year:** Prepare for next year (if preferred)\n\n🏛️ **Available Colleges:**\n• Private engineering colleges\n• Diploma to degree programs\n• Specialized courses (AI/ML, Cyber Security)\n\n📈 **Success Stories:**\n• Many students improve significantly in MHT-CET\n• College matters less than your skills & effort\n• Focus on learning & building projects\n\nWould you like MHT-CET guidance or college options?`;
        }
    }
    
    getNEETCollegeSuggestions(score) {
        if (score >= 600) {
            return `🏥 **Excellent NEET Score: ${score}!**\n\n🏆 **Government Medical Colleges:**\n• Grant Medical College, Mumbai\n• B.J. Medical College, Pune\n• Govt Medical College, Nagpur\n• Govt Medical College, Aurangabad\n\n💰 **Fees:** ₹50,000-1L per year\n📚 **Seats:** 150-200 per college\n🎯 **Admission:** State counseling (85% quota)\n\n📅 **Next Steps:**\n1. Register for NEET counseling\n2. Prepare required documents\n3. Research college preferences\n\nNeed counseling procedure details?`;
        } else if (score >= 550) {
            return `🌟 **Good NEET Score: ${score}!**\n\n🎯 **Options Available:**\n• Government colleges (OBC/EWS quota)\n• Private medical colleges (Management quota)\n• Deemed universities\n• AYUSH courses (High chances)\n\n💰 **Fee Range:**\n• Government: ₹50K-1L/year\n• Private: ₹8-15L/year\n• Deemed: ₹15-25L/year\n\n🔄 **Alternative Paths:**\n• BDS (Dental) - Lower cutoffs\n• BAMS/BHMS - AYUSH colleges\n• Physiotherapy, Nursing\n\nInterested in specific streams?`;
        } else {
            return `💪 **NEET Score: ${score}**\n\n🎯 **Available Options:**\n• Private medical colleges (Management quota)\n• AYUSH courses (BAMS, BHMS, BUMS)\n• Paramedical courses\n• Allied health sciences\n\n💡 **Smart Alternatives:**\n• **BPharma:** Good career prospects\n• **Physiotherapy:** Growing field\n• **Medical Lab Technology:** Stable career\n• **Nursing:** High demand\n\n🔄 **Future Planning:**\n• Gap year for NEET improvement\n• Foreign medical colleges\n• Alternative healthcare careers\n\nWould you like details about any specific option?`;
        }
    }
    
    getMHTCETCollegeSuggestions(percentile) {
        if (percentile >= 95) {
            return `🎉 **Outstanding MHT-CET: ${percentile} Percentile!**\n\n🏆 **Top Government Colleges:**\n• COEP Pune - CS/IT (Guaranteed)\n• VJTI Mumbai - CS/IT\n• Govt College of Engineering, Pune\n• Walchand College, Sangli\n\n💰 **Fees:** ₹80,000-1.2L per year\n📈 **ROI:** Best in Maharashtra\n🎯 **Placements:** 6-25 LPA average\n\n🔥 **Pro Tip:** Government colleges offer best value for money!\n\nWhich city do you prefer?`;
        } else if (percentile >= 85) {
            return `🌟 **Excellent MHT-CET: ${percentile} Percentile!**\n\n🏛️ **Great Options:**\n• COEP Pune - Mechanical/Civil/Electrical\n• VJTI Mumbai - All branches\n• Government colleges in Nagpur, Aurangabad\n• Top autonomous colleges\n\n💡 **Strategy:**\n• Government colleges for core branches\n• Autonomous colleges for CS/IT\n• Consider location preferences\n\n📊 **Expected Outcomes:**\n• Government seat almost guaranteed\n• Good branch selection available\n\nNeed city-wise college lists?`;
        } else {
            return `📈 **MHT-CET Score: ${percentile} Percentile**\n\n🎯 **Available Options:**\n• Government colleges (lower preference branches)\n• Autonomous colleges (Good chances)\n• University colleges\n• Private colleges (Management quota)\n\n💰 **Fee Planning:**\n• Government: ₹80K-1.2L\n• Autonomous: ₹1.5-2.5L\n• Private: ₹2-4L\n\n🔄 **Counseling Strategy:**\n• Fill maximum choices\n• Consider branch flexibility\n• Keep backup options ready\n\nNeed counseling guidance?`;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Handle multiline text
        const lines = text.split('\n');
        if (lines.length > 1) {
            lines.forEach((line, index) => {
                if (line.trim()) {
                    const lineDiv = document.createElement('div');
                    lineDiv.textContent = line;
                    messageDiv.appendChild(lineDiv);
                } else if (index < lines.length - 1) {
                    messageDiv.appendChild(document.createElement('br'));
                }
            });
        } else {
            messageDiv.textContent = text;
        }
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        messageDiv.appendChild(timestamp);
        
        this.chatbotMessages?.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.isTyping = true;
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'flex';
            this.chatbotMessages?.appendChild(this.typingIndicator);
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        this.isTyping = false;
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'none';
        }
    }

    scrollToBottom() {
        if (this.chatbotMessages) {
            this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
        }
    }

    autoResizeInput() {
        if (this.chatbotInput) {
            this.chatbotInput.style.height = 'auto';
            this.chatbotInput.style.height = Math.min(this.chatbotInput.scrollHeight, 100) + 'px';
        }
    }

    checkRateLimit() {
        const now = Date.now();
        
        // Reset counter if more than a minute has passed
        if (now - this.lastRequestTime > this.config.RATE_LIMIT.COOLDOWN_PERIOD) {
            this.requestCount = 0;
        }
        
        // Check if under rate limit
        if (this.requestCount >= this.config.RATE_LIMIT.MAX_REQUESTS_PER_MINUTE) {
            return false;
        }
        
        this.requestCount++;
        this.lastRequestTime = now;
        return true;
    }

    // Public method to clear conversation history
    clearHistory() {
        this.conversationHistory = [];
        this.chatbotMessages.innerHTML = '';
        this.addWelcomeMessage();
    }

    // Public method to export conversation
    exportConversation() {
        return {
            timestamp: new Date().toISOString(),
            history: this.conversationHistory
        };
    }
}

// Initialize chatbot when DOM is loaded or immediately if already loaded
function initializeChatbot() {
    console.log('Initializing Unipulse Chatbot...');
    try {
        window.unipulseChatbot = new UnipulseChatbot();
        console.log('✅ Chatbot initialized successfully!');
    } catch (error) {
        console.error('❌ Chatbot initialization failed:', error);
        // Retry after a short delay
        setTimeout(initializeChatbot, 500);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    // DOM is already loaded
    setTimeout(initializeChatbot, 100);
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnipulseChatbot;
}
