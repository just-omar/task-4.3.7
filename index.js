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

const searchRepos = debounce(searcRepos, 400);

input.addEventListener("keyup", searchRepos);

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
      itemRep.addEventListener("click", funcClick);
      element.append(itemRep);
    });
  }
}

async function searcRepos() {
  const valueInput = input.value;
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

let funcBtnClose = function (e) {
  e.target.parentElement.remove();
  e.target.removeEventListener("click", funcBtnClose);
};

let funcClick = function (e) {
  let value = e.target.innerText;
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
      btnClose.addEventListener("click", funcBtnClose);
      fragment.appendChild(responseItem);
      input.value = "";
      repNameList.style.display = "none";
    }
  });
  responselist.prepend(fragment);
  itemRep.removeEventListener("click", funcClick);
};
