Function.prototype.render = function () {
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
