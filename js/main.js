$(function(){

    /*
        *****************  TODO  *********************** 
        Inputs:
            First name: Only Letters
            Last name: Only Letters
            Username: 4-6 Letters followed by 1-3 numbers
            Birth Date: Members need to be at least 18 years old
            When created gym members should get an ID number (increment by 1 each new member)

        OutPuts:
            List that should display:
                ID
                Firstname
                Last name
                Username
                Age(not Birthday)
                Enrollment Date
                Delete Member Button
            -Upon click button the user should be asked to confirm, if true delete the member from the list
            -Filter based on a text box using first name, last name, username
            -Should be sortable by id, name, first name, last name, username, or age
            -Gyme Member Storage:
                -Keep an up-to-date array containing all members
                -When a member is deleted, remove the gym member from the array

    */
    $("#memberList").hide();


    //Constructor function for members
    function Member(id, firstName, lastName, userName, age, enrollmentDate){
        this.id = members.length + 1;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.age = age;
        this.enrollmentDate = enrollmentDate;
  
    }
    //Auto index member id
    // Initialize the starting ID


    let members = [];

    //pre-made members for the array
    members.push(new Member(null, "Alex", "Tindall", "alex123", 28, new Date()));
    members.push(new Member(null, "John", "Doe", "john456", 30, new Date()));
    members.push(new Member(null, "Emily", "Smith", "emily789", 22, new Date()));




    //Validates for 8 letters then 3 numbers
    function validateUsername(username)
    {
        let usernameRegex = new RegExp('^[a-zA-Z]{4,6}[0-9]{1,3}$');
        return usernameRegex.test(username);
    }

    //Validates for only letters
    function validateName(name)
    {
        let nameRegex = new RegExp('^[a-zA-Z]*$');
        return nameRegex.test(name);
    }

    //Validates for over 18 years old
    function validateAge(date)
    {
        const age = getAge(date)

        return age >= 18
    }

    //Function from: https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd
    function getAge(birthDate) {
        var now = new Date();
    
        function isLeap(year) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
        }
    
        // days since the birthdate    
        var days = Math.floor((now.getTime() - birthDate.getTime())/1000/60/60/24);
        var age = 0;
        // iterate the years
        for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++){
        var daysInYear = isLeap(y) ? 366 : 365;
        if (days >= daysInYear){
            days -= daysInYear;
            age++;
            // increment the age only if there are available enough days for the year.
        }
        }
        return age;
    }


    //Adding event listeners for each input and using the validation functions to output errors to the labels
//TODO CREATE A NEW ID FOR ON SUBMIT

    $('#memberFirstName').on('keyup blur', function() {
        //Using the name validation function and passing in the value
        const isValid = validateName($(this).val());

        if(!isValid)
        {
            $(this).addClass("invalid");
            $('#memberFirstNameLabel').text("First Name: (use letters)");
        } else {
            $(this).removeClass("invalid");
            $('#memberFirstNameLabel').text("First Name:");
        }
    });
    $('#memberLastName').on('keyup blur', function() {
        //Using the name validation function and passing in the value
        const isValid = validateName($(this).val());

        if(!isValid)
        {
            $(this).addClass("invalid");
            $('#memberLastNameLabel').text("Last Name: (use letters)");
        } else {
            $(this).removeClass("invalid");
            $('#memberLastNameLabel').text("Last Name:");
        }
    });

    $('#memberUsername').on('keyup blur', function() {
        //Using the username validation function and passing in the value
        const isValid = validateUsername($(this).val());

        if(!isValid)
        {
            $(this).addClass("invalid");
            $('#memberUsernameLabel').text("Username: (use 4-6 letters and 1-3 numbers)");
        } else {
            $(this).removeClass("invalid");
            $('#memberUsernameLabel').text("Username:");
        }
    });


    //Also adding a change event to the pet birthday
    $('#memberBirthday').on('keyup change blur', function() {
        //Using the username validation function and passing in the value
        //You could use this.valueAsDate but the timezone will be off so I am doing the following:
        const birthday = new Date($(this).val().replaceAll('-','/'))
        const isValid = validateAge(birthday);

        if(!isValid)
        {
            $(this).addClass("invalid");
            $('#memberBirthdayLabel').text("Birthday: (Must be 18 or older)");
        } else {
            $(this).removeClass("invalid");
            $('#memberBirthdayLabel').text("Birthday:");
        }
    });


    //Listening for form submission on the form element: SEARCH_SUBMIT
    $('#memberForm').on('submit', function(e){
        e.preventDefault();

        //Getting the elements on submission. 
        //I can use the values going forward
        const $firstName = $('#memberFirstName');
        const $lastName = $('#memberLastName');
        const $userName = $('#memberUsername');


        //====Dates in JavaScript, we have discussed this, but here it is again and with jQuery: SEARCH_DATE
        //Non-jquery Way of getting a date (Note the time zone difference)
        let memberBirthday = document.getElementById('memberBirthday').valueAsDate
       
        //jQuery way of getting a date (The val is a string so it needs to be converted to a date) (Note the time zone difference)
        memberBirthday = new Date($('#memberBirthday').val())

        //Converting the -'s in the string to /'s will use the correct timezone.    ¯\_(ツ)_/¯ JavaScript ¯\_(ツ)_/¯
        memberBirthday = new Date($('#memberBirthday').val().replaceAll('-','/'))


        //Runs validation for all of our form inputs (except submit)
        if( 
            validateName(  $firstName.val()  ) &&
            validateName(  $lastName.val()  ) &&
            validateUsername(  $userName.val() ) &&
            validateAge(  memberBirthday )  )
        {
            //If everything is valid, use the push method to add to an array: SEARCH_ADD_TO_ARRAY
            members.push( new Member( 
                members.length + 1,
                $firstName.val(),
                $lastName.val(),
                $userName.val(),
                getAge(memberBirthday),
                new Date()
            ));
            this.reset();
            console.log(members);

            
        }
        DisplayMembers()


        //Display the new list
       

    });
        function DisplayMembers(){
            //Get a sorted member list
            //TODO: Update this with a filtered list of member
            let filteredMembers = getFilteredList();

            //Displaying the member list
            $listContainer = $('.member-list--members');
            //Clear the old list out
            $listContainer.html('');

            $(filteredMembers).each(function() {
                $listContainer.append(`
                    <div class="member" data-id="${this.id}">
                        <span class="member-id">${this.id}</span>
                        <span class="member-firstname">${this.firstName}</span>
                        <span class="member-lastname">${this.lastName}</span>
                        <span class="member-username">${this.userName}</span>
                        <span class="member-age">${this.age}</span>
                        <span class="member-enrollment-date">${(this.enrollmentDate)}</span>
                    </div>
                `);
            });
        }
    
        function sortById(a, b) {
            if(a.id < b.id) 
            {
                return -1;
            }
            if(a.id > b.id)
            {
                return 1;
            }
            return 0;
        
        }

        
        //Filtering
        function filterByKeyword(member) {
            const lowerCaseKeyword = $("#filterKeyword").val().toLowerCase();
          
            const containsFirstName = member.firstName && typeof member.firstName === 'string' && member.firstName.toLowerCase().includes(lowerCaseKeyword);
            const containsLastName = member.lastName && typeof member.lastName === 'string' && member.lastName.toLowerCase().includes(lowerCaseKeyword);
            const containsId = member.id && typeof member.id.toString() === 'string' && member.id.toString().includes(lowerCaseKeyword);
            const containsUserName = member.userName && typeof member.userName === 'string' && member.userName.toLowerCase().includes(lowerCaseKeyword);
            const containsAge = member.age && typeof member.age.toString() === 'string' && member.age.toString().includes(lowerCaseKeyword);
          
            return containsFirstName || containsLastName || containsId || containsUserName || containsAge;
          }
          


        //Get a filtered list from based on the inputs: SEARCH_USING_FILTERS_SORTING
        function getFilteredList() {
            let filteredMembers = members.filter(filterByKeyword);
            debugger
            switch($("#filterSort").val())
            {
                case "id":
                    filteredMembers = filteredMembers.sort(sortById);
                    break;
                case "firstname":
                    filteredMembers = filteredMembers.sort(sortByFirstName);
                    break;
                case "lastname":
                filteredMembers = filteredMembers.sort(sortByLastName);
                break;
                case "username":
                    filteredMembers = filteredMembers.sort(sortByUserName);
                    break;
                case "age":
                    filteredMembers = filteredMembers.sort(sortByAge);
                    break;

            }

            return filteredMembers;
        }

        function sortByFirstName(a, b) {
            const firstNameA = a.firstName.toLowerCase();
            const firstNameB = b.firstName.toLowerCase();
            if (firstNameA < firstNameB) {
              return -1;
            }
            if (firstNameA > firstNameB) {
              return 1;
            }
            return 0;
          }
          
          function sortByLastName(a, b) {
            const lastNameA = a.lastName.toLowerCase();
            const lastNameB = b.lastName.toLowerCase();
            if (lastNameA < lastNameB) {
              return -1;
            }
            if (lastNameA > lastNameB) {
              return 1;
            }
            return 0;
          }
          
          function sortByUserName(a, b) {
            const userNameA = a.userName.toLowerCase();
            const userNameB = b.userName.toLowerCase();
            if (userNameA < userNameB) {
              return -1;
            }
            if (userNameA > userNameB) {
              return 1;
            }
            return 0;
          }
          
          function sortByAge(a, b) {
            return a.age - b.age;
          }

        $("#filterKeyword, #filterSort").on("keyup blur change", function (e) {
            DisplayMembers();
          });

        $("#viewForm").on("click", function(e){
            const $addMemberForm = $("#memberAdd");
            const $memberList= $("#memberList");
            $("#viewForm").addClass("active");
            $("#viewList").removeClass("active");
            $("#viewList").addClass("not-active");
            $("#viewForm").removeClass("not-active");

            if(!$addMemberForm.is(":visible"))
            {  
                $memberList.fadeOut(100, function(){
                    $addMemberForm.fadeIn();
                });
            }
        });

        $("#viewList").on("click", function(e){
            const $addMemberForm = $("#memberAdd");
            const $memberList= $("#memberList");
            $("#viewList").addClass("active");
            $("#viewForm").removeClass("active");
            $("#viewForm").addClass("not-active");
            $("#viewList").removeClass("not-active");

            if(!$memberList.is(":visible"))
            {
                $addMemberForm.fadeOut(100, function(){
                    $memberList.fadeIn();
                });
            }
        });

        //====Delete a Member====
        $('.member-list--members').on('click', function(e) {
            //Listing for the list to be clicked and then finding the closest member
            $target = $(e.target).closest('.member')

            //Check if we found a member
            if($target.length > 0) {
                //Get the id from the data attribute
                id = $target.data('id')

                //We can use the findIndex function (works like our filter function) to get the
                //  position of an item in an array
                memberIndex = members.findIndex(function(item) {
                    return item.id == id
                })

                //Ask for confirmation
                if( window.confirm("Are you sure you want to delete " + members[memberIndex].firstName + members[memberIndex].lastName + "?") )
                {
                    //We can use splice to tell JavaScript what to remove
                    //  splice(wheretostart, howmany)
                    members.splice(memberIndex, 1) 
                }
            }
            
            //Redisplay the new list
            DisplayMembers()
        })
    //#endregion


    //Run any default functionality:
    DisplayMembers()
});
