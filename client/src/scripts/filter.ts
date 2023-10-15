export const filterPhoneSection = async (filterParams: any) => {

    console.log("filtering...");
    const brandDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(1) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const osDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(2) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const specialOffersDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(3) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const inStorePickupDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(4) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const priceDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(5) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const conditionDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(6) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const availabilityDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(7) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const colorDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(8) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    
    brandDropdown && brandDropdown.click();
    osDropdown && osDropdown.click();
    specialOffersDropdown && specialOffersDropdown.click();
    inStorePickupDropdown && inStorePickupDropdown.click();
    priceDropdown && priceDropdown.click();
    conditionDropdown && conditionDropdown.click();
    availabilityDropdown && availabilityDropdown.click();
    await colorDropdown && colorDropdown.click();

    function getCheckboxByValue(val : string) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox : any) {
            if (checkbox.attributes.value.value === val) {
                checkbox.click();
            }
        });
    }

    for(const val of filterParams){
        await getCheckboxByValue(val);
    }

    setTimeout(() => {
        const apply : HTMLElement | null = document.querySelectorAll('[data-testid="applyFilter"]') as any
        apply && apply.click();
      }, 1000);

}

export const filterTabletSection = async (filterParams: any) => {
    console.log("filtering...");
    const brandDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(1) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const osDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(2) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const specialOffersDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(3) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const inStorePickupDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(4) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const priceDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(5) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const conditionDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(6) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const availabilityDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(7) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const colorDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(8) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    
    brandDropdown && brandDropdown.click();
    osDropdown && osDropdown.click();
    specialOffersDropdown && specialOffersDropdown.click();
    inStorePickupDropdown && inStorePickupDropdown.click();
    priceDropdown && priceDropdown.click();
    conditionDropdown && conditionDropdown.click();
    availabilityDropdown && availabilityDropdown.click();
    await colorDropdown && colorDropdown.click();


    function getCheckboxByValue(val : string) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox : any) {
            if (checkbox.attributes.value.value === val) {
                checkbox.click();
            }
        });
    }

    for(const val of filterParams){
        await getCheckboxByValue(val);
    }

    setTimeout(() => {
        const apply : HTMLElement | null = document.querySelectorAll('[data-testid="applyFilter"]') as any
        apply && apply.click();
      }, 1000);
}