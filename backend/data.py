KNOWN_SKILLS = [
    "Python", "Java", "SQL", "Machine Learning",
    "React", "JavaScript", "Data Analysis"
]

COURSE_MAP = {
    "Machine Learning": ["Intro", "Regression", "Projects"],
    "React": ["JS Basics", "Components", "Build App"],
    "Python": ["Syntax", "Libraries", "Projects"]
}

edges = [
        # ── TECH FOUNDATIONS ──
        ("Computer Basics",         "Microsoft Excel"),
        ("Computer Basics",         "Microsoft Office"),
        ("Computer Basics",         "HTML"),
        ("Computer Basics",         "CSS"),
        ("HTML",                    "JavaScript"),
        ("CSS",                     "JavaScript"),
        ("JavaScript",              "React"),
        ("JavaScript",              "Node.js"),
        ("JavaScript",              "TypeScript"),
        ("TypeScript",              "React"),
        ("Node.js",                 "Express.js"),
        ("Node.js",                 "Backend Development"),
        ("React",                   "Full Stack Development"),
        ("Backend Development",     "Full Stack Development"),

        # ── PROGRAMMING ──
        ("Computer Basics",         "Python"),
        ("Python",                  "NumPy"),
        ("Python",                  "Pandas"),
        ("NumPy",                   "Data Analysis"),
        ("Pandas",                  "Data Analysis"),
        ("Python",                  "FastAPI"),
        ("Python",                  "Django"),
        ("Python",                  "Flask"),
        ("Java",                    "Spring Boot"),
        ("Computer Basics",         "Java"),
        ("Computer Basics",         "C++"),
        ("Computer Basics",         "SQL"),

        # ── DATA & ML ──
        ("Data Analysis",           "Data Visualization"),
        ("SQL",                     "Data Analysis"),
        ("Data Analysis",           "Machine Learning"),
        ("Python",                  "Machine Learning"),
        ("Mathematics",             "Machine Learning"),
        ("Statistics",              "Machine Learning"),
        ("Mathematics",             "Statistics"),
        ("Machine Learning",        "Deep Learning"),
        ("Machine Learning",        "Natural Language Processing"),
        ("Machine Learning",        "scikit-learn"),
        ("Deep Learning",           "TensorFlow"),
        ("Deep Learning",           "PyTorch"),
        ("Deep Learning",           "Computer Vision"),
        ("Data Analysis",           "Business Intelligence"),
        ("Data Visualization",      "Business Intelligence"),
        ("SQL",                     "Database Administration"),
        ("Database Administration", "PostgreSQL"),
        ("Database Administration", "MySQL"),

        # ── DEVOPS & CLOUD ──
        ("Linux Basics",            "Networking Fundamentals"),
        ("Networking Fundamentals", "Network Administration"),
        ("Linux Basics",            "Shell Scripting"),
        ("Shell Scripting",         "DevOps"),
        ("Git",                     "DevOps"),
        ("DevOps",                  "Docker"),
        ("Docker",                  "Kubernetes"),
        ("DevOps",                  "CI/CD Pipelines"),
        ("Networking Fundamentals", "AWS"),
        ("Linux Basics",            "AWS"),
        ("AWS",                     "Cloud Architecture"),
        ("Docker",                  "AWS"),

        # ── MOBILE ──
        ("JavaScript",              "React Native"),
        ("Swift",                   "iOS Development"),
        ("Computer Basics",         "Swift"),
        ("Dart",                    "Flutter"),
        ("Computer Basics",         "Dart"),

        # ── HR DOMAIN ──
        ("Communication",           "HR Fundamentals"),
        ("HR Fundamentals",         "Recruitment"),
        ("HR Fundamentals",         "Employee Relations"),
        ("HR Fundamentals",         "Onboarding"),
        ("HR Fundamentals",         "HR Policies"),
        ("HR Fundamentals",         "Benefits Administration"),
        ("Microsoft Excel",         "HR Reporting"),
        ("HR Reporting",            "HR Analytics"),
        ("HR Fundamentals",         "Performance Management"),
        ("Performance Management",  "Employee Development"),
        ("Recruitment",             "Talent Acquisition"),
        ("HR Fundamentals",         "Labor Law"),
        ("Labor Law",               "Payroll Processing"),
        ("Microsoft Excel",         "Payroll Processing"),
        ("HR Fundamentals",         "HRIS"),
        ("Microsoft Excel",         "HRIS"),

        # ── MARKETING & COMMUNICATIONS ──
        ("Communication",           "Content Writing"),
        ("Communication",           "Public Relations"),
        ("Content Writing",         "Copywriting"),
        ("Content Writing",         "Social Media Management"),
        ("Social Media Management", "Digital Marketing"),
        ("Digital Marketing",       "SEO"),
        ("Digital Marketing",       "Email Marketing"),
        ("Digital Marketing",       "Marketing Analytics"),
        ("Microsoft Excel",         "Marketing Analytics"),
        ("Communication",           "Brand Management"),
        ("Brand Management",        "Marketing Strategy"),
        ("Marketing Strategy",      "Campaign Management"),
        ("Communication",           "Event Management"),

        # ── DESIGN ──
        ("Computer Basics",         "Adobe Photoshop"),
        ("Adobe Photoshop",         "Adobe Illustrator"),
        ("Adobe Illustrator",       "InDesign"),
        ("Adobe Photoshop",         "UI Design"),
        ("UI Design",               "UX Design"),
        ("UX Design",               "Figma"),

        # ── FINANCE & ACCOUNTING ──
        ("Mathematics",             "Accounting Fundamentals"),
        ("Microsoft Excel",         "Accounting Fundamentals"),
        ("Accounting Fundamentals", "Financial Reporting"),
        ("Accounting Fundamentals", "Bookkeeping"),
        ("Financial Reporting",     "Financial Analysis"),
        ("Financial Analysis",      "Financial Modeling"),
        ("Microsoft Excel",         "Financial Modeling"),
        ("Accounting Fundamentals", "Tax Preparation"),
        ("Accounting Fundamentals", "Auditing"),

        # ── PROJECT MANAGEMENT ──
        ("Communication",           "Team Collaboration"),
        ("Team Collaboration",      "Project Management"),
        ("Project Management",      "Agile Methodology"),
        ("Project Management",      "Scrum"),
        ("Project Management",      "Risk Management"),
        ("Project Management",      "Stakeholder Management"),
        ("Microsoft Excel",         "Project Management"),

        # ── BUSINESS & CONSULTING ──
        ("Communication",           "Business Communication"),
        ("Business Communication",  "Business Analysis"),
        ("Business Analysis",       "Process Improvement"),
        ("Microsoft Excel",         "Business Analysis"),
        ("Process Improvement",     "Change Management"),
        ("Business Analysis",       "Requirements Gathering"),
        ("Communication",           "Negotiation"),
        ("Negotiation",             "Sales"),
        ("Sales",                   "Customer Relationship Management"),
        ("Customer Relationship Management", "CRM Tools"),

        # ── HEALTHCARE ──
        ("Communication",           "Patient Care"),
        ("Biology",                 "Medical Terminology"),
        ("Medical Terminology",     "Clinical Documentation"),
        ("Clinical Documentation",  "Electronic Health Records"),
        ("Patient Care",            "Healthcare Compliance"),

        # ── SOFT SKILLS FOUNDATION ──
        ("Communication",           "Leadership"),
        ("Leadership",              "Team Management"),
        ("Team Management",         "Strategic Planning"),
        ("Communication",           "Problem Solving"),
        ("Problem Solving",         "Critical Thinking"),
        ("Critical Thinking",       "Decision Making"),
    ]