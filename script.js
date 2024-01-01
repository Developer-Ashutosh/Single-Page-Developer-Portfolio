// Function to scroll smoothly to the top
const scrollWindow = () => {
    const toTopBtn = document.querySelector('.top-btn');

    document.body.addEventListener('scroll', () => {
        toTopBtn.style.opacity = (document.body.scrollTop > 100) ? '1' : '0';
        toTopBtn.style.pointerEvents = (document.body.scrollTop > 100) ? 'auto' : 'none';
    });

    toTopBtn.addEventListener('click', () => {
        document.body.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// Function to handle form validation
const validateForm = () => {
    const form = document.querySelector('form');
    const fields = form.querySelectorAll('.field');
    const sendBtn = form.querySelector('#send-btn');

    sendBtn.addEventListener('click', () => {
        fields.forEach(field => {
            const input = field.querySelector('.input');
            const span = field.querySelector('span');

            if (input.value === '') {
                handleValidationErrors(input, span, 'This field is required.');
            } else if (input.id === 'email' && !input.value.includes('@')) {
                handleValidationErrors(input, span, 'Sorry, invalid email format.');
            } else {
                resetValidationState(input, span);
            }
        });
    });
};

// Helper function to handle validation errors
const handleValidationErrors = (input, span, errorMessage) => {
    input.classList.add('error');
    span.classList.add('error-icon');
    span.textContent = errorMessage;
    span.style.display = 'block';
};

// Helper function to reset validation state
const resetValidationState = (input, span) => {
    input.classList.remove('error');
    span.classList.remove('error-icon');
    span.style.display = 'none';
};

// Function to fetch data from JSON files
const fetchData = async (section, sectionAttr, more = false) => {
    const response = await fetch(`./JSON Files/${section}.json`);
    const data = await response.json();
    const sectionElement = document.querySelector(sectionAttr);
    sectionElement.innerHTML = '';

    const startIndex = more ? data.length : Math.min(6, data.length);

    data.slice(0, startIndex).forEach(sectionData => {
        const div = (section === 'skills') ? createSkills(sectionData) : createProjects(sectionData);
        sectionElement.append(div);
    });

    toggleMoreBtn(sectionElement, data);
};

// Function to create skills element
const createSkills = (skill) => {
    const { title, experience } = skill;
    return createDivElement('skills', `
        <h2 class="skill">${title}</h2>
        <p class="experience">${experience}</p>`
    );
};

// Function to create projects element
const createProjects = (project) => {
    const { title, thumbnail, languages, links, isNew, isFeatured } = project;
    return createDivElement('project', `
        <div class="project-view">
            <img src="${thumbnail}" alt="${title}">
            <div class="project-links">
                <a target="_blank" href="${links.project}" class="view-project btn">View Project</a>
                <a target="_blank" href="${links.code}" class="view-code btn">View Code</a>
            </div>
            <div class = "project-tags">
                <div class ="featured-project" style="display: ${isFeatured ? 'block' : 'none'};">${isFeatured ? 'featured' : ''}</div>
                <div class ="new-project" style=" display: ${isNew ? 'block' : 'none'};">${isNew ? 'new' : ''}</div>
            </div>
        </div>
        <h3 class="project-title">${title}</h3>
        <div class="project-stack-tags">
           ${languages.map(e => `<span class="project-stack-tag">${e}</span>`).join('')}
        </div>`
    );
};

// Function to create a generic div element
const createDivElement = (className, innerHTML) => {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = innerHTML;
    return div;
};

// Function to toggle the visibility of the 'View More' button
const toggleMoreBtn = (sibling, data) => {
    const moreBtn = sibling.parentElement.querySelector('#view-more-btn');
    moreBtn.style.display = (data.length > 6) ? 'block' : 'none';
};

// Event listeners for 'View More' buttons
const fetchMoreData = () => {
    const moreBtns = document.querySelectorAll('#view-more-btn');
    moreBtns.forEach(moreBtn => {
        const span = moreBtn.querySelector('span');
        moreBtn.addEventListener('click', () => {
            const section = moreBtn.parentElement.classList.contains('skills-section') ? 'skills' : 'projects';
            const sectionAttr = section === 'skills' ? '#skills-section' : '.projects';
            (span.textContent.trim() === 'more') ? fetchData(section, sectionAttr, true) : fetchData(section, sectionAttr);
            span.textContent = (span.textContent.trim() === 'more') ? 'less' : 'more';
        });
    });
};

// Call the functions
scrollWindow();
validateForm();
fetchData('skills', '#skills-section');
fetchData('projects', '.projects');
fetchMoreData();
