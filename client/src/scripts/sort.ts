const sortOptions = new Map<string, string>([["Featured", ""], ["Best Sellers", "best-sellers"], ["Newest", "newest"], ["Price Low to High", "price-low-to-high"], ["Price High to Low", "high-to-low"]])

function getPathFromUrl(url : string) {
    return url.split("?")[0];
}

export const sortBy = (optionParam : string) => {
    // ["Featured", "Best Sellers", "Newest", "Price Low to High", "Price High to Low"]
    // ["gridwall-sort-by-dropdown-Featured", "gridwall-sort-by-dropdown-Best Sellers", "gridwall-sort-by-dropdown-Newest", "gridwall-sort-by-dropdown-Price Low To High", "gridwall-sort-by-dropdown-Price High To Low"]
    const element : HTMLSelectElement = document.querySelector("#sby > span > span > div > select") as HTMLSelectElement;
    
    console.log(element);

    const base = getPathFromUrl(window.location.href);
    window.location.href = `${base}/?sort=${sortOptions.get(optionParam)}`
    
}