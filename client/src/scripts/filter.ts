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
  
    
    // applyFilter
    
    // const brandBoxes : HTMLElement = document.getElementById('#clnr2qe00005q359mr9ec2jj8') as HTMLElement;
    
    // brandBoxes.click();

    // for(const val of filterParams){
    //     if(val.length === 0){
    //         continue;
    //     }

    //     for(const item of val){

    //     }
    // }


    
    // if ($('body:contains("Filter")').length) {
    //     for(const [key, param] of filterParams.entries()){
    //         if(!param){
    //             continue;
    //         } else {
    //             console.log(key, param);
    //             // const element = document.querySelector(`[data-testid="${param}"]`);
    //             const element : HTMLElement = document.querySelector('#accordian-content > div > div > div:nth-child(1)') as HTMLElement;
                
    //             if (element) {
    //                 element.click();
    //                 console.log('Element found:', element);
    //             } else {
    //                 console.log('Element not found.');
    //             }
                  
                               
    //         }
    //     }
    //     // filterParams.map((x : any) => console.log(x));
    // } else {
    //     console.log("No Filter on Page.");
    // }

}

export const filterTabletSection = async (filterParams: any) => {
    
}