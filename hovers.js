const initHovers = () => {
  const mouseEnter = (e) => {
    const link = e.target;
    const linkBox = link.getBoundingClientRect();
    stuckX = Math.round(linkBox.left + linkBox.width / 2);
    stuckY = Math.round(linkBox.top + linkBox.height / 2);
    isStuck = true;
  }

  const mouseLeave = (e) => {
    isStuck = false;
  }

  const linkElements = document.querySelectorAll('.link');

  linkElements.forEach((linkElement) => {
    linkElement.addEventListener('mouseenter', mouseEnter);
    linkElement.addEventListener('mouseleave', mouseLeave);
  })
}

initHovers();