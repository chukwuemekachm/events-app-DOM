Object.prototype.render = function () {
  return this.wrapper;
}

function getComponents() {
  function EventCard(props) {
    const articleWrapper = document.createElement('article');
    articleWrapper.classList.add('event-card');
    const eventLink = document.URL + '?event=' + props.eventId;

    // Image Over Lay
    const imageOverLay = document.createElement('div');
    imageOverLay.classList.add('event-card-image-overlay');

    if (props.isPremium) {
      const premiumTag = new PremiumTag();
      imageOverLay.appendChild(premiumTag.render());
    } else {
      const eventBadge = new EventBadge({ type: props.type });
      imageOverLay.appendChild(eventBadge.render());
    }

    const socialMediaLinks = new SocialMediaLinksWrapper({ eventLink });
    imageOverLay.appendChild(socialMediaLinks.render());
    articleWrapper.appendChild(imageOverLay);

    const eventImage = document.createElement('img');
    eventImage.classList.add('event-card-image');
    eventImage.src = props.imageURL;
    articleWrapper.appendChild(eventImage);

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('event-card-description-wrapper');
    const eventTitle = new EventTitle({ title: props.title });
    const eventTime = new EventTime({ time: props.time });
    const eventVenue = new EventVenue({ venue: props.venue });
    const applyButton = new Button({ text: 'See Details', eventId: props.eventId });

    descriptionWrapper.appendChild(eventTitle.render());
    descriptionWrapper.appendChild(applyButton.render());
    descriptionWrapper.appendChild(eventTime.render());
    descriptionWrapper.appendChild(eventVenue.render());

    articleWrapper.appendChild(descriptionWrapper);

    this.wrapper = articleWrapper;
  }

  function SocialMediaLink(props) {
    const supportedProviderLinks = {
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
      twitter: 'https://twitter.com/intent/tweet?text=',
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url',
    };

    let wrapper = null;

    if (supportedProviderLinks[props.type]) {
      wrapper = document.createElement('a');
      wrapper.classList.add('event-card-link-item', props.type);
      wrapper.setAttribute('target', '_blank');
      wrapper.setAttribute('href', String(supportedProviderLinks[props.type] + props.link));
      wrapper.innerHTML = `<ion-icon name=logo-${props.type}></ion-icon>`;
    } else {
      throw new Error('Un-supported SocialMediaLink type');
    }

    this.wrapper = wrapper;
  }

  function SocialMediaLinksWrapper(props) {
    const eventLinksWrapper = document.createElement('div');
    eventLinksWrapper.classList.add('event-card-links-wrapper');

    ['facebook', 'twitter', 'linkedin'].forEach((link) => {
      const socialMediaLink = new SocialMediaLink({ type: link, link: props.eventLink });
      eventLinksWrapper.appendChild(socialMediaLink.render());
    });

    this.wrapper = eventLinksWrapper;
  }

  function PremiumTag() {
    const wrapper = document.createElement('span');
    wrapper.classList.add('event-card-premium');
    wrapper.innerHTML = `<ion-icon name="shield-checkmark"></ion-icon>`;

    this.wrapper = wrapper;
  }

  function PremiumTextTag() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('premium-text-wrapper');

    const textNode = document.createElement('span');
    textNode.classList.add('event-card-premium-text');
    textNode.textContent = 'Premium Only Webinar';

    wrapper.appendChild(new PremiumTag().render());
    wrapper.appendChild(textNode);

    this.wrapper = wrapper;
  }

  function EventBadge(props) {
    const wrapper = document.createElement('span');
    wrapper.classList.add('event-card-badge', props.type.replace(' ', ''));
    wrapper.textContent = props.type.replace('-', '').toUpperCase();

    this.wrapper = wrapper;
  }

  function EventVenue(props) {
    const wrapper = document.createElement('span');
    wrapper.classList.add('event-card-venue');
    wrapper.innerHTML = `<ion-icon md="pin"></ion-icon> ${props.venue}`;

    this.wrapper = wrapper;
  }

  function EventTime(props) {
    const wrapper = document.createElement('span');
    wrapper.classList.add('event-card-time');
    wrapper.innerHTML = `<ion-icon md="calendar"></ion-icon> ${props.time}`;

    this.wrapper = wrapper;
  }

  function EventTitle(props) {
    const wrapper = document.createElement('h3');
    wrapper.classList.add('event-card-title');
    wrapper.textContent = props.title;

    this.wrapper = wrapper;
  }

  function EventDescription(props) {
    const wrapper = document.createElement('p');
    wrapper.classList.add('event-card-description');
    wrapper.textContent = props.description;

    this.wrapper = wrapper;
  }

  function Button(props) {
    const wrapper = document.createElement('button');
    wrapper.classList.add('apply-button', props.isBlock && 'block');

    if (props.eventId) {
      wrapper.setAttribute('data-event-id', props.eventId);
    }

    wrapper.setAttribute('data-event-type', props.isPremium ? 'premium' : 'regular');
    wrapper.textContent = props.text;

    this.wrapper = wrapper;
  }

  function ModalContent(props) {
    const modalContentWrapper = document.createElement('div');
    modalContentWrapper.classList.add('modal-content');

    const header = document.createElement('header');
    header.classList.add('modal-header');
    header.innerHTML = `
      <h2>${props.modalTitle}</h2>
      <span class="modal-close">
        <ion-icon name="close-circle-outline"></ion-icon>
      </span>
    `;

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.appendChild(props.children);

    modalContentWrapper.appendChild(header);
    modalContentWrapper.appendChild(modalBody);

    this.wrapper = modalContentWrapper;
  }

  function EventPreview(props) {
    const eventPreviewWrapper = document.createDocumentFragment();
    const eventLink = document.URL + '?event=' + props.eventId;

    const eventImage = document.createElement('img');
    eventImage.classList.add('event-card-image', 'image-preview');
    eventImage.src = props.imageURL;

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('event-card-description-wrapper');

    const eventTitle = new EventTitle({ title: props.title });
    const eventTime = new EventTime({ time: props.time });
    const eventVenue = new EventVenue({ venue: props.venue });
    const applyButton = new Button({ text: 'Apply', eventId: props.eventId, isBlock: true, isPremium: props.isPremium });
    const socialMediaLinks = new SocialMediaLinksWrapper({ eventLink });

    if (!props.isPremium) {
      const eventBadge = new EventBadge({ type: props.type });
      descriptionWrapper.appendChild(eventBadge.render());
    }
    descriptionWrapper.appendChild(eventTitle.render());
    descriptionWrapper.appendChild(eventTime.render());
    descriptionWrapper.appendChild(eventVenue.render());

    if (props.isPremium) {
      descriptionWrapper.appendChild(new PremiumTextTag().render());
    }

    descriptionWrapper.appendChild(applyButton.render());

    const eventDescription = document.createElement('p');
    eventDescription.classList.add('event-card-description');
    eventDescription.textContent = props.description;

    const eventPreviewLinksWrapper = document.createElement('p');
    eventPreviewLinksWrapper.classList.add('modal-links-wrapper');
    eventPreviewLinksWrapper.appendChild(socialMediaLinks.render());

    descriptionWrapper.appendChild(eventDescription);

    eventPreviewWrapper.appendChild(eventImage);
    eventPreviewWrapper.appendChild(descriptionWrapper);
    eventPreviewWrapper.appendChild(eventPreviewLinksWrapper);

    this.wrapper = eventPreviewWrapper;
  }

  function Alert(props) {
    const alertIcons = {
      success: 'checkmark-circle',
      error: 'information-circle',
    };
    const wrapper = document.createElement('div');
    wrapper.classList.add('alert-dialog', props.type);
    wrapper.innerHTML = `
      <ion-icon name="${alertIcons[props.type]}"></ion-icon>
      <span>${props.message}</span>
    `;

    if (props.type === 'error') {
      wrapper.appendChild(new Button({ text: 'Learn more about Premium membership' }).render());
    }

    this.wrapper = wrapper;
  }

  return {
    Button,
    EventDescription,
    EventTitle,
    EventTime,
    EventVenue,
    EventBadge,
    PremiumTag,
    PremiumTextTag,
    SocialMediaLink,
    SocialMediaLinksWrapper,
    EventCard,
    ModalContent,
    EventPreview,
    Alert,
  };
}


function initApp(components, eventsData) {
  const mainWrapper = document.getElementById('__ROOT__');
  const portalWrapper = document.getElementById('__PORTAL__');

  function renderOnPortal(node) {
    while (portalWrapper.firstChild) {
      portalWrapper.firstChild.remove();
    }
    portalWrapper.appendChild(node);
    portalWrapper.style.display = 'flex';
  }

  function closePortal() {
    portalWrapper.style.display = 'none';
  }

  if (mainWrapper) {
    const domFragment = document.createDocumentFragment();
    eventsData.forEach(event => {
      domFragment.append(new components.EventCard(event).render());
    });

    mainWrapper.addEventListener('click', function (event) {
      if (event.target.tagName === 'BUTTON') {
        const attributes = event.target.attributes;

        if (attributes['data-event-id']) {
          const event = eventsData.find(data => data.eventId === attributes['data-event-id'].value);
          const modalContent = new components.ModalContent({
            modalTitle: 'Event Preview',
            children: new components.EventPreview(event).render(),
          });
          renderOnPortal(modalContent.render());
        }
      }
    })

    mainWrapper.appendChild(domFragment);
  }

  if (portalWrapper) {
    portalWrapper.addEventListener('click', function (event) {
      if (event.target.tagName === 'BUTTON') {
        const attributes = event.target.attributes;

        if (attributes['data-event-id'] && attributes['data-event-type']) {
          let modalContent = null;

          if (attributes['data-event-type'].value === 'regular') {
            modalContent = new components.ModalContent({
              modalTitle: 'Application Success',
              children: new components.Alert({
                type: 'success',
                message: 'You\'ve successfully applied for this event.',
              }).render(),
            });
          } else {
            modalContent = new components.ModalContent({
              modalTitle: 'Application Failed',
              children: new components.Alert({
                type: 'error',
                message: 'Sorry this webinar is for premium members only.',
              }).render(),
            });
          }

          renderOnPortal(modalContent.render());
        }

        if (
          !attributes['data-event-id'] &&
          attributes['data-event-type'] &&
          attributes['data-event-type'].value === 'regular'
        ) {
          closePortal();
        }
      }

      if (event.target.tagName === 'ION-ICON') {
        const attributes = event.target.attributes;

        if (attributes.name && attributes.name.value === 'close-circle-outline') {
          closePortal();
        }
      }
    })
  }
}

const mocksData = [
  {
    eventId: '02',
    title: 'Two Park Seminar',
    type: 'premium-only webinar',
    time: 'April 15th 2020',
    venue: 'WhiteField Parklane, Ilupeju Lagos.',
    isPremium: true,
    imageURL: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    eventId: '03',
    title: 'Women in Tech',
    type: 'hackaton',
    time: 'April 21st 2020',
    venue: 'WhiteField Parklane, Ilupeju Lagos.',
    isPremium: false,
    imageURL: 'https://images.pexels.com/photos/942419/pexels-photo-942419.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    eventId: '04',
    title: 'Career fair',
    type: 'mission',
    time: 'April 30th 20120',
    venue: 'WhiteField Parklane, Ilupeju Lagos.',
    isPremium: false,
    imageURL: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    eventId: '01',
    title: 'Web Development Webinar',
    type: 'premium-only webinar',
    time: 'April 10th 2020',
    venue: 'WhiteField Parklane, Ilupeju Lagos.',
    isPremium: true,
    imageURL: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    eventId: '05',
    title: 'GraphQL Webinar',
    type: 'open webinar',
    time: 'May 10th 2020',
    venue: 'WhiteField Parklane, Ilupeju Lagos.',
    isPremium: false,
    imageURL: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    eventId: '06',
    title: 'Open VR',
    type: 'meet up',
    time: 'May 20th 2020',
    venue: 'WhiteField Parklane, Ilupeju Lagos.',
    isPremium: false,
    imageURL: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    eventId: '07',
    title: 'GraphQL happy hour',
    type: 'leap',
    time: 'May 25th 2020',
    venue: 'WhiteField Parklane, Ilupeju Lagos.',
    isPremium: false,
    imageURL: 'https://images.pexels.com/photos/3321793/pexels-photo-3321793.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    eventId: '08',
    title: 'Open AR',
    type: 'meet up',
    time: 'June 5th 2020',
    venue: 'WhiteField Parklane, Ilupeju Lagos.',
    isPremium: false,
    imageURL: 'https://images.pexels.com/photos/1481276/pexels-photo-1481276.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
];

initApp(getComponents(), mocksData);
