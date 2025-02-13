var students = [];

fetch("https://cs571api.cs.wisc.edu/rest/f24/hw2/students", {
	headers: {
		"X-CS571-ID": CS571.getBadgerId()
	}
})
	.then(res => res.json())
	.then(data => {
		students = [...data];
		buildStudents(students);
	})

function buildStudents(studs) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.
	const numStudentsHTML = document.getElementById("num-results");
	numStudentsHTML.innerHTML = ' ';
	numStudentsHTML.innerHTML = studs.length;
	
	const nameHTML = document.getElementById("students");
	nameHTML.innerHTML = ' ';
	
	for (let i = 0; i < studs.length; i++) {
		let student = studs[i];

		const studentRowHTML = document.createElement("div");
		studentRowHTML.className = "col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3";
		const nameRowHTML = document.createElement("h3");
		const majorRowHTML = document.createElement("h6");
		const creditswiscRowHTML = document.createElement("p");
		const numinterestsRowHTML = document.createElement("p");
		const interestsRowHTML = document.createElement("ul");

		nameRowHTML.innerText = student.name.first + " " + student.name.last;
		majorRowHTML.innerText = student.major;
			if (student.fromWisconsin == false) {
				creditswiscRowHTML.innerText = student.name.first + " is taking " + student.numCredits + " credits and is not from Wisconsin.";
			} else {
				creditswiscRowHTML.innerText = student.name.first + " is taking " + student.numCredits + " credits and is from Wisconsin.";
			}
		numinterestsRowHTML.innerText = "They have " + student.interests.length + " interests including...";
		for (let i = 0; i < student.interests.length; i++) {
				const listItem = document.createElement("li");
				listItem.textContent = student.interests[i];
				listItem.id = "interestEntry";
				interestsRowHTML.appendChild(listItem);
		}
		studentRowHTML.append(nameRowHTML);
		studentRowHTML.append(majorRowHTML);
		studentRowHTML.append(creditswiscRowHTML);
		studentRowHTML.append(numinterestsRowHTML);
		studentRowHTML.append(interestsRowHTML);
		nameHTML.append(studentRowHTML);
		}
	}
	
	


function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!
	let searchnameHTML = document.getElementById("search-name").value;
	let searchmajorHTML = document.getElementById("search-major").value;
	let searchinterestHTML = document.getElementById("search-interest").value;
	let studentsSearch = students.filter(student => {
		let fullName = String(student.name.first + " " + student.name.last).toLowerCase();
		let searchName = searchnameHTML.toLowerCase();
		return fullName.includes(searchName);
	}).filter(student => student.interests.some(interests => interests.toLowerCase().includes(searchinterestHTML.toLowerCase()))
	).filter(student => student.major.toLowerCase().includes(searchmajorHTML.toLowerCase()));
	buildStudents(studentsSearch);
}

document.getElementById("search-btn").addEventListener("click", handleSearch);

document.getElementById("students").addEventListener("click", (e) => {
    if (e.target && e.target.id === "interestEntry") {
	document.getElementById("search-name").value = ' ';
	document.getElementById("search-major").value = ' ';
	document.getElementById("search-interest").value = e.target.innerText;
	handleSearch(e);
	}
    // TODO update the search terms to search just for the
    //      selected interest, and re-run the search!
})
