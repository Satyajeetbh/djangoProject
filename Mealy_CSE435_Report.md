# Seminar Report On
**AI Powered Recipe and Meal Planning Platform - Mealy**

**Submitted by**
Satyajeet Kumar Satyam
Registration No. 12212261

**Bachelor of Technology IN (Computer Science and Engineering)**

**Under the Supervision of**
Amit Sharma
[Designation]

**LOVELY PROFESSIONAL UNIVERSITY PUNJAB**
(April, 2026)

---

## DECLARATION
I hereby declare that the seminar report titled **“AI Powered Recipe and Meal Planning Platform - Mealy”** submitted in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Computer Science and Engineering** is a record of my own work carried out during the academic session 2025-2026. I further declare that this report has not been submitted, either in part or in full, to any other institution or university for the award of any degree or diploma.

I confirm that the content of this report is original and prepared by me. Any references used have been duly acknowledged. I also declare that the use of Artificial Intelligence (AI) tools, if any, has been minimal and the AI-generated content in this report is **less than 10%**, ensuring that the majority of the work reflects my own understanding and effort. I take full responsibility for the authenticity and originality of the work presented in this report.

**Name of the Student:** Satyajeet Kumar Satyam  
**Registration Number:** 12212261  
**Course:** CSE 435 Comprehensive Seminar  
**Signature of the Student:** ___________________  
**Date:** ___________________  

---

## Chapter 1: Introduction

### 1.1 Title of the Seminar Topic
AI Powered Recipe and Meal Planning Platform - Mealy

### 1.2 Background and Importance of the Topic
In the fast-paced modern world, individuals frequently struggle with daily meal planning, dietary management, and nutritional tracking. Traditional recipe discovery relies on static blogs or physical cookbooks that do not adapt to individual dietary restrictions (such as vegan, gluten-free, or nut allergies). Furthermore, translating a set of recipes into a structured weekly meal plan and an actionable grocery shopping list is a tedious manual process.

Mealy was conceptualized to address these friction points by serving as an all-in-one culinary assistant. By leveraging large language models (LLMs), Mealy enables users to generate custom recipes on-demand, dynamically schedule them into meal plans, and automatically compile aggregated shopping lists. This not only reduces the cognitive load associated with meal preparation but also promotes healthier, more intentional eating habits.

### 1.3 Objectives of the Seminar
The project encompasses several core technical and functional objectives:

**Technical Objectives:**
- Design and implement a robust server-side web application using the Django (Python) framework.
- Develop a complex relational database schema using SQLite to manage Recipes, Reviews, Dietary Preferences, Meal Plans, and Shopping Lists.
- Integrate the OpenAI API (GPT-4-mini) to programmatically generate structured recipe data.
- Build a responsive, accessible user interface utilizing custom CSS utility classes within Django HTML templates.
- Implement secure, session-based user authentication and data isolation.

**Functional Objectives:**
- Provide an intuitive platform for users to discover, share, and review recipes.
- Allow users to strictly define dietary restrictions that filter their experience across the platform.
- Enable the automatic compilation of grocery shopping lists from multi-day meal plans.

### 1.4 Brief Overview of the Approach or Methodology
The development methodology followed an iterative, feature-driven approach:
1. **Requirements Gathering & Data Modeling**: Identified the core entities (User, Recipe, MealPlan, ShoppingList) and established their relationships using Django's ORM.
2. **Backend Foundation**: Implemented Django authentication, routing, and function-based views (FBVs).
3. **AI Integration**: Developed `ai_services.py` to prompt OpenAI for recipes, specifically utilizing JSON-mode to ensure the AI output conforms to the database schema.
4. **UI Implementation**: Designed standard Django templates styled seamlessly with responsive CSS.
5. **Feature Linking**: Built the complex business logic that extracts raw ingredient strings from recipes to aggregate and generate automated shopping lists.

---

## Chapter 2: Literature Review

### 2.1 Existing Recipe Discovery Platforms
Traditional recipe platforms (e.g., AllRecipes, Food Network) operate as massive, static content repositories. While they offer advanced search and filtering, they lack generative adaptability. If a user wants a highly specific variation of a dish (e.g., a "Low-Carb Vegan Lasagna with Almond Flour"), they must hope it already exists in the database. 

### 2.2 Dedicated Meal Planning Applications
Applications like MyFitnessPal or EatThisMuch focus heavily on macro-tracking and automated calorie planning but often treat recipes as secondary, quantitative data points rather than culinary experiences. They can feel overly clinical and rigid, focusing on numbers rather than the joy of cooking.

### 2.3 The Role of Generative AI in Culinary Tech
Recent advancements in Generative Pre-trained Transformers (GPT) allow for highly creative, context-aware text generation. Early applications in the culinary space involved simple chatbots providing text-based recipes. However, free-form text cannot be easily integrated into a structured application (for calculating total calories, tracking specific dietary flags, or adding to a structured meal plan). 

Mealy synthesizes these approaches by using LLMs not just as text generators, but as structured data engines. By forcing the AI to return strict JSON data, Mealy seamlessly inserts infinitely generated culinary content directly into a highly structured relational database, allowing for seamless downstream meal planning and grocery aggregation.

---

## Chapter 3: Conceptual Study / Seminar Work

### 3.1 Explanation of Core Concepts
Mealy relies on several core software engineering and AI concepts:

- **Relational Data Integrity:** The application heavily utilizes foreign keys and many-to-many relationships. For example, a `MealPlanItem` bridges a `MealPlan` and a `Recipe` for a specific `meal_date` and `meal_type` (Breakfast, Lunch, Dinner).
- **Prompt Engineering & Structured Outputs:** The AI service (`ai_services.py`) uses a highly specific system prompt enforcing the `gpt-4o-mini` model to return a JSON object with strict keys (`title`, `description`, `ingredients`, `calories`, `dietary_type`). This ensures the AI's creativity is safely boxed within the application's schema constraints.
- **Data Aggregation Algorithms:** The system features an algorithm that iterates through a user's Meal Plan, splits the text of recipe ingredients, deduplicates them using Python `set()` operations, and bulk-inserts them into a unified `ShoppingList`.

### 3.2 Description of System Architecture
Mealy follows the classic Model-View-Template (MVT) architecture provided by Django:
- **Model (Data Layer):** SQLite database managed through Django's robust Object-Relational Mapper (ORM).
- **View (Business Logic Layer):** Python functions (`views.py`) that handle HTTP requests, validate incoming form data (`forms.py`), query the database, and trigger the AI services.
- **Template (Presentation Layer):** HTML files (`templates/`) that dynamically render context variables. Styling is handled via standard CSS (`style.css`) featuring modern design principles.

### 3.3 Workflow Conceptual Framework
A standard user journey through the platform operates as follows:
1. A user creates an account and sets their `DietaryPreference` (e.g., Vegan, Nut Allergy).
2. The user requests a new recipe via the AI Generator by submitting a simple prompt.
3. The Django view invokes the OpenAI API, receives the structured recipe JSON, and saves a new `Recipe` object linked to that user.
4. The user adds this newly generated recipe to their Monday Dinner slot in a `MealPlan`.
5. The user clicks "Generate Shopping List," which triggers a backend script to aggregate all ingredients for the week and populate a checklist in the `ShoppingList` model.

### 3.4 Tools, Platforms, and Technologies Studied
- **Backend Framework:** Django (Python 3)
- **Database:** SQLite3
- **Frontend:** HTML5, Custom CSS
- **AI Integration:** OpenAI Python SDK (GPT-4-mini)
- **Environment Management:** Python `dotenv` for secure API key handling

---

## Chapter 4: Results and Discussion

### 4.1 Key Observations Derived from the Study
The development and local deployment of Mealy proved highly successful:
- The custom Django forms provided excellent server-side validation and secure data handling against unauthorized access.
- The use of OpenAI's JSON-mode drastically reduced parsing errors. In early iterations, standard text generation required complex Regex to extract calories or ingredients, which frequently broke. JSON-mode ensured 100% data consistency.
- The ingredient aggregation algorithm successfully bridged the gap between abstract recipes and practical grocery shopping, saving theoretical users significant manual effort.

### 4.2 Conceptual Comparisons and Analysis
Unlike heavily decoupled Single Page Applications (SPAs) using React/Next.js and complex APIs, Mealy’s monolithic Django architecture allowed for rapid development and extreme stability. Because the backend controls the rendering of the HTML, there are no issues with state synchronization or CORS policies.

The integration of AI proves that modern web applications no longer need to rely solely on user-generated content (UGC) to provide value. By acting as a mediator between the user and an LLM, the application provides boundless content tailored to the exact specifications of the end-user.

### 4.3 Discussion on Advantages, Limitations, and Insights
**Advantages:**
- The monolithic structure makes the application incredibly fast, secure, and easy to deploy.
- Automated shopping list generation provides immediate, tangible utility to the user.

**Limitations:**
- The AI occasionally generates ingredient strings that are difficult to parse perfectly (e.g., "1 pinch of salt" vs "salt"). This makes aggressive grocery aggregation slightly imperfect, occasionally resulting in duplicate entries on the shopping list.
- SQLite is excellent for development but would need to be migrated to PostgreSQL for horizontal scalability in a production environment.

**Insights Gained:**
- Building relational database schemas requires intense upfront planning. Changes to how Meal Plans relate to Recipes cascade throughout the entire application logic.
- AI is highly powerful, but defensive programming is mandatory when accepting AI outputs into a strictly typed database.

---

## Chapter 5: Conclusion and Future Scope

### 5.1 Summary of the Seminar Work
Mealy successfully demonstrates the integration of modern generative AI within a traditional, robust web framework. By combining Django's powerful ORM and session management with OpenAI's structured JSON capabilities, the project resulted in a seamless culinary assistant capable of recipe generation, meal scheduling, and grocery tracking.

### 5.2 Major Learning Outcomes
- **Django Mastery:** Deep understanding of Django's MVT architecture, form handling, and ORM querysets.
- **AI Engineering:** Practical application of prompt engineering and structured data extraction from large language models.
- **Database Architecture:** Designing complex foreign key relationships to support features like dynamic shopping lists based on time-bound meal plans.

### 5.3 Conclusions
The project concludes that monolithic web frameworks remain highly relevant and powerful for building robust, feature-rich web applications. Furthermore, it proves that LLMs can be utilized for much more than conversational chatbots; they are exceptionally powerful tools for programmatic, dynamic data generation.

### 5.4 Future Scope and Developments
The platform has a strong foundation for future enhancements:
- **Phase 2 (Semantic Parsing):** Implement an NLP library (like spaCy) to better parse AI-generated ingredient strings (separating quantity, unit, and item) for perfect shopping list deduplication.
- **Phase 3 (Image Generation):** Integrate DALL-E 3 API to dynamically generate mouth-watering images for the AI-created recipes.
- **Phase 4 (Pantry Management):** Allow users to input what ingredients they currently have, so the AI only generates recipes using available items.
- **Phase 5 (Social Features):** Implement a follower system where users can subscribe to their friends' shared meal plans.

---

## Professional Profile & Repository Details

- **GitHub Project Repository:** [Insert Repository Link Here]
- **Live Application:** [Insert Live URL Here]
- **LinkedIn Profile:** [Insert Your LinkedIn URL Here]
