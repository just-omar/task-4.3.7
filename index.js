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
  element.replaceChildren();
  if (dataRes.items.length === 0) {
    console.log(1);
    repNameList.insertAdjacentHTML(
      "beforeend",
      `<li>Совпадений не найдено </li>`
    );
  }
  if (data) {
    data.forEach((item) => {
      itemRep = document.createElement("li");
      itemRep.textContent = `${item}`;
      itemRep.addEventListener("click", pickRepo);
      element.append(itemRep);
    });
  }
}

async function searchRepos() {
  const valueInput = input.value;
  console.log(valueInput);
  repNameList.style.display = "block";
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
  console.log("REMOVE func");
  e.target.parentElement.remove();
  e.target.removeEventListener("click", removeRepo);
};

let pickRepo = function (e) {
  console.log("PICK func");
  let value = e.target.innerText;
  console.log(value);
  const fragment = document.createDocumentFragment();
  dataRes.items.forEach((item) => {
    if (item.name === value) {
      const responseItem = document.createElement("ul");
      responseItem.insertAdjacentHTML(
        "beforeend",
        `<li>Name: ${item.name}</li>`
      );
      responseItem.insertAdjacentHTML(
        "beforeend",
        `<li>Owner: ${item.owner.login}</li>`
      );
      responseItem.insertAdjacentHTML(
        "beforeend",
        `<li>Stars: ${item.stargazers_count}</li>`
      );
      const btnClose = document.createElement("button");
      responseItem.appendChild(btnClose);
      btnClose.addEventListener("click", removeRepo);
      fragment.appendChild(responseItem);
      input.value = "";
      repNameList.style.display = "none";
    }
  });
  responselist.prepend(fragment);
  itemRep.removeEventListener("click", pickRepo);
};
