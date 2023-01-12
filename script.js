let curMode="light";
const getJSON = async function(url){
    try{
        const data =await fetch(url)
        if(!data.ok)
            return data.ok
        return data.json()
    }catch(err){
        alert(err)
    }
}
const getCountries =async function(url){
    try{
        const a = await getJSON(url);
        return a
    }catch(err){
        alert(err)
    }
}
const setCountries= async function () {
    try{
        const data=await getCountries("https://restcountries.com/v3.1/all");
        data.forEach(element => {
            displayCountries(document.querySelector(".flags .row"), element)
        });
    }catch(err){
        alert(err)
    }
}
const filterCountries = async function(continent){
    try{
        const data=await getCountries(`https://restcountries.com/v3.1/region/${continent}`);
        data.forEach(element => {
            displayCountries(document.querySelector(".filter-flags .row"), element)
        });
        document
          .querySelectorAll(".el")
          .forEach((el) => {
            if(curMode=="dark"){
                el.style.backgroundColor = "hsl(209, 23%, 22%)"}
            else{
                el.style.backgroundColor = "hsl(0, 0%, 98%)";
            }
            });
    }catch(err){
        alert(err)
    }
}

const search=async function(name){
    try{
        const data = await getCountries(
          `https://restcountries.com/v3.1/name/${name}`
        );
        if(!data){
            return
        }
        data.forEach(element => {
            displayCountries(document.querySelector(".filter-flags .row"), element)
        });
        document.querySelectorAll(".el").forEach((el) => {
          if (curMode == "dark") {
            el.style.backgroundColor = "hsl(209, 23%, 22%)";
          } else {
            el.style.backgroundColor = "hsl(0, 0%, 98%)";
          }
        });
    }catch(err){
        alert(err)
    }
}
const getCountry= async function(url){
    try {
      const a = await getJSON(url);
      return a;
    } catch (err) {
      alert(err);
    }
}
const displayCountry=async function (data) {
    try{
        console.log(data.borders);
        let a =" "
        if(data.languages!==undefined){
          a=data.languages.reduce((total, el) => {
              total = total + el.name + ",";
              return total;
            }, " ")}
        let b=" "
        if(data.borders!==undefined){
            b=data.borders.reduce((total, el) => { return (total = total + `<div class="back ms-3">${el}</div>` + " ");}, " ")
        }
        document.querySelector(".country-data").innerHTML=""
        document.querySelector(".country-data").insertAdjacentHTML(
          "afterbegin",
          `
        <div class="col-sm-5 col-10 mt-4 ms-4">
                        <picture>
                            <img src="${data.flag}" alt="">
                        </picture>
                    </div>
                    <div class="col-sm-6 col-10 mt-4 ms-4">
                        <h2>Name</h2>
                        <div class="country-about row">
                            <div class="col-12 col-sm-6 p-0 mt-3">
                                <p>Native:<span>${data.nativeName}</span></p>
                                <p>Population:<span>${data.population.toLocaleString(
                                  "en-US"
                                )}</span></p>
                                <p>Region:<span>${data.region}</span></p>
                                <p>Sub Region: <span>${
                                  data.subregion
                                }</span></p>
                                <p>capital:<span>${data.capital}</span></p>
                            </div>
                            <div class="col-12 col-sm-6 p-0 mt-3">
                                <p>Top level Domain:<span>${
                                  data.topLevelDomain
                                }</span></p>
                                <p>Currencies:<span>${
                                  data.currencies[0].name
                                }</span></p>
                                <p>languages:<span>${a.slice(0, -1)}</span></p>
                            </div>
                            <div class="col-10 p-0 mt-3">
                                <p> border-countries:</p>
                                <div class="d-flex flex-wrap">
                                    ${b}
                                </div>
                            </div>
                        </div>
                    </div>
        `
        );
    }catch(err){
        console.log(err);
        document.querySelector(".country-data").innerHTML = `<div class="m-5">SORRY !!!data of country not present</div>`;
    }
}
const countryInfo = async function(data){
    try{
        const a = await getCountry(
          `https://restcountries.com/v2/name/${data}?fullText=true`
        );
        await displayCountry(a[0])
    }catch(err){
        alert(err)
    }
} 
document.addEventListener("keydown",async function(el){
    if(el.key=="Enter"){
         document.querySelector(".loader").classList.remove("hidden");
        document.querySelector(".home .row").classList.add("hidden");
        document.querySelector(".filter-flags").classList.remove("hidden");
        document.querySelector(".filter-flags .row").innerHTML = "";
        setTimeout(() => {
            document.querySelector(".loader").classList.add("hidden");
            search(document.querySelector("input").value);
        }, 1000);
        }
})
const displayCountries=async function(node,data){
    node.insertAdjacentHTML(
      "afterbegin",
      `<div class="card country-card col-3 m-4 el" data-country="${data.name.official.toLowerCase()}">
                            <picture>
                                <img src="${data.flags.png}" alt="">
                            </picture>
                            <div class="info">
                                <p class="country-name">${data.name.common}</p>
                                <p>Population:<span>${data.population.toLocaleString("en-US")}</span></p>
                                <p>Region:    <span>${data.region}</span></p>
                                <p>Capital:   <span>${data.capital}</span></p>
                            </div>
                        </div>`
    );
}
document.querySelector("select").addEventListener("change", async function(el){
   document.querySelector(".home .row").classList.add("hidden");
   document.querySelector(".filter-flags").classList.remove("hidden");
   document.querySelector(".loader").classList.remove("hidden");
   document.querySelector(".filter-flags .row").innerHTML = "";
    await setTimeout(() => {
        const data = el.target.value;
     document.querySelector(".loader").classList.add("hidden");
        filterCountries(data);
    }, 1000);
})
document.querySelector(".back").addEventListener("click",el=>{
    document.querySelector(".home").classList.remove("hidden");
    document.querySelector(".specific").classList.add("hidden");
});
document.querySelectorAll(".home").forEach(el=>{
    el.addEventListener("click",async function(e){
        if(e.target.closest(".country-card")){
            document.querySelector(".home").classList.add("hidden");
            document.querySelector(".loader").classList.remove("hidden");
            document.querySelector(".country-data").innerHTML = "";
            
            const data = await e.target.closest(".country-card").dataset.country;
            setTimeout(() => {
                document.querySelector(".specific").classList.remove("hidden");
                document.querySelector(".loader").classList.add("hidden");
                countryInfo(data);
            
            }, 1000);
        }
    })
})
setCountries()
const setMode=function(c1,c2,c3){
    document.querySelector('body').style.backgroundColor= c2;
    document.querySelector("body").style.color = c1;
    document.querySelector("select").style.color = c1;
    document.querySelector("input").style.color = c1;
    document
      .querySelectorAll(".el")
      .forEach((el) => (el.style.backgroundColor = c3));
}
document.querySelector(".dark-mode").addEventListener("click",el=>{
    if(curMode=="light"){
        setMode('#fff',`hsl(207, 26%,17%)`,`hsl(209, 23%, 22%)`)
        document.querySelector(".bi-moon").classList.add("hidden")
        document.querySelector(".bi-moon-fill").classList.remove("hidden");
        curMode="dark"
    }else{
        setMode('#000',`hsl(0, 0%,98%)`,`hsl(0, 0%, 100%)`)
        document.querySelector(".bi-moon").classList.remove("hidden");
        document.querySelector(".bi-moon-fill").classList.add("hidden");
        curMode="light"
    }
})
