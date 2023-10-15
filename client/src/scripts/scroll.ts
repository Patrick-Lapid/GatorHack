function getCurrentScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

// Function to scroll the window up or down by a specified number of pixels
function scrollWindowByPixels(pixels : number) {
    const currentScrollPosition = getCurrentScrollPosition();
    const targetScrollPosition = currentScrollPosition + pixels;

    // Scroll to the target position
    window.scrollTo({
        top: targetScrollPosition,
        behavior: 'smooth' // Use 'auto' for instant scroll
    });
}
  

export const scroll = (direction : string) => {
    if(direction === "Up"){
        scrollWindowByPixels(600);
    } else {
        scrollWindowByPixels(-600);
    }
    
}