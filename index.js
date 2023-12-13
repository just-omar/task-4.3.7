const input = document.querySelector(".input");
const repNameList = document.querySelector(".autocomplete-list");
const responselist = document.querySelector(".response-list");

let nameRep = [];
let dataRes;

const debounce = (fn, ms) => {
  let timer;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timer);
    timer = setTimeout(fnCall, ms);
  };
};

const debouncedSearch = debounce(searchRepos, 400);

input.addEventListener("input", debouncedSearch);

function loadRep(data, element) {
  //   console.log(dataRes);
  element.replaceChildren();
  if (dataRes.items.length === 0) {
    // console.log(1);
    const nameItem = document.createElement("li");
    nameItem.textContent = `Совпадений не найдено`;
    repNameList.appendChild(nameItem);
  }
  if (data) {
    console.log(data);
    data.forEach((item) => {
      itemRep = document.createElement("li");
      itemRep.textContent = `${item}`;
      itemRep.addEventListener("click", pickRepo);
      element.append(itemRep);
    });
  }
}

async function searchRepos(e) {
  const valueInput = e.target.value;
  //   console.log(valueInput);
  //   repNameList.classList.remove("hidden");
  return await fetch(
    `https://api.github.com/search/repositories?q=${valueInput}&per_page=5`
  )
    .then((res) => {
      res.json().then((data) => {
        dataRes = data;
        nameRep = data.items.map((el) => el.name);
        loadRep(nameRep, repNameList);
      });
    })
    .catch((e) => console.log(e));
}

let removeRepo = function (e) {
  //   console.log("REMOVE func");
  e.target.parentElement.remove();
  e.target.removeEventListener("click", removeRepo);
};

let pickRepo = function (e) {
  //   console.log("PICK func");
  //   console.log(value);
  let value = e.target.innerText;
  const fragment = document.createDocumentFragment();
  dataRes.items.forEach((item) => {
    if (item.name === value) {
      const responseItem = document.createElement("ul");

      const nameItem = document.createElement("li");
      nameItem.textContent = `Name: ${item.name}`;
      responseItem.appendChild(nameItem);

      const ownerItem = document.createElement("li");
      ownerItem.textContent = `Owner: ${item.owner.login}`;
      responseItem.appendChild(ownerItem);

      const starsItem = document.createElement("li");
      starsItem.textContent = `Stars: ${item.stargazers_count}`;
      responseItem.appendChild(starsItem);

      const btnClose = document.createElement("button");
      responseItem.appendChild(btnClose);
      btnClose.addEventListener("click", removeRepo);
      fragment.appendChild(responseItem);
      input.value = "";
      //   repNameList = [];
      while (repNameList.firstChild) {
        repNameList.removeChild(repNameList.lastChild);
      }

      //   repNameList.classList.add("hidden");
    }
  });
  responselist.prepend(fragment);
  itemRep.removeEventListener("click", pickRepo);
};
