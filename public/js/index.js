$(function() {
  // Get references to page elements
  const $newPostButton = $("#newPostBtn");
  const $submitNewPost = $("#submitNewPostBtn");
  const $exampleText = $("#example-text");
  const $exampleDescription = $("#example-description");
  const $submitBtn = $("#submit");
  const $exampleList = $("#example-list");
  const $newUserSubmit = $("#submitAccount");
  const $newUserName = $("#registerUserName");
  const $newUserEmail = $("#registerEmail");
  const $newUserPass = $("#registerPassword");
  const $userName = $("#logInUserName");
  const $userPass = $("#logInPassword");
  const $userLogInButton = $("#logInAccount");
  const $signOutButton = $("#signOut");
  const $newPostContent = $("#newPostContent");
  const $newPostTitle = $("#newPostTitle");
  let userInformation = JSON.parse(sessionStorage.getItem("cornHubUser"));
  console.log(userInformation);
  let userJWT;
  let category;
  if (userInformation !== null) {
    userJWT = userInformation.data[1];
  }
  console.log(userJWT);
  // The API object contains methods for each kind of request we'll make
  var API = {
    postRequest: function(example, targetURL) {
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: targetURL,
        data: JSON.stringify(example)
      });
    },
    submitPost: function(post, targetURL) {
      return $.ajax({
        headers: {
          Authorization: `Bearer ${userJWT}`
        },
        type: "POST",
        url: targetURL,
        data: JSON.stringify(post),
        otherData: JSON.stringify(post)
      });
    },
    getExamples: function() {
      return $.ajax({
        url: targetURL,
        type: "GET"
      });
    },
    deleteExample: function(id) {
      return $.ajax({
        url: `${targetURL}/${id}`,
        type: "DELETE"
      });
    }
  };

  // refreshExamples gets new examples from the db and repopulates the list
  var refreshExamples = function() {
    API.getExamples().then(function(data) {
      var $examples = data.map(function(example) {
        var $a = $("<a>")
          .text(example.text)
          .attr("href", "/example/" + example.id);

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": example.id
          })
          .append($a);

        var $button = $("<button>")
          .addClass("btn btn-danger float-right delete")
          .text("ｘ");

        $li.append($button);

        return $li;
      });

      $exampleList.empty();
      $exampleList.append($examples);
    });
  };

  // handleFormSubmit is called whenever we submit a new example
  // Save the new example to the db and refresh the list
  var handleFormSubmit = function(event) {
    event.preventDefault();

    var example = {
      text: $exampleText.val().trim(),
      description: $exampleDescription.val().trim()
    };

    if (!(example.text && example.description)) {
      alert("You must enter an example text and description!");
      return;
    }

    API.saveExample(example).then(function() {
      refreshExamples();
    });

    $exampleText.val("");
    $exampleDescription.val("");
  };

  // handleDeleteBtnClick is called when an example's delete button is clicked
  // Remove the example from the db and refresh the list
  var handleDeleteBtnClick = function() {
    var idToDelete = $(this)
      .parent()
      .attr("data-id");

    API.deleteExample(idToDelete).then(function() {
      refreshExamples();
    });
  };

  const createNewUser = function() {
    const userName = $newUserName.val().trim();
    const userEmail = $newUserEmail.val().trim();
    const userPass = $newUserPass.val().trim();

    const newUser = {
      name: userName,
      email: userEmail,
      password: userPass
    };

    $(".newUserErrorMessage").hide();
    if (
      !(
        userName &&
        userName.length < 10 &&
        userName.length > 3 &&
        userEmail &&
        userPass
      )
    ) {
      $(".invalidField")
        .show()
        .css({ color: "red" })
        .addClass("text-center");
    } else {
      API.postRequest(newUser, "/api/newUser").then(function(data) {
        console.log(data);
        if (data.newUser) {
          $("#registerAccountModal").modal("toggle");
          $(".newUserErrorMessage").hide();
          $newUserName.val("");
          $newUserEmail.val("");
          $newUserPass.val("");
        } else {
          $(".userAlreadyExists")
            .show()
            .css({ color: "red" })
            .addClass("text-center");
        }
      });
    }
  };

  const userLogOut = function() {
    sessionStorage.setItem("cornHubUser", null);
    location.reload();
  };

  const userLogIn = function() {
    const userName = $userName.val().trim();
    const userPass = $userPass.val().trim();
    const user = {
      userName: userName,
      password: userPass
    };
    API.postRequest(user, "/api/login").then(data => {
      userInformation = data;
      sessionStorage.setItem("cornHubUser", JSON.stringify(data));
      userJWT = data.data[1];
      $(".close").trigger("click");
    });
  };

  const newPostModal = function() {
    category = $(this).data("category");
    $("#newPostModal").modal("toggle");
  };

  // submitPost: function(example, targetURL) {
  //   return $.ajax({
  //     headers: {
  //       "Authorization": `Bearer ${userJWT}`
  //     },
  //     type: "POST",
  //     url: targetURL,
  //     data: JSON.stringify(example)
  //   });

  const submitNewPost = function() {
    const newPost = {
      userName: userInformation.data[0].userName,
      category: category,
      corntent: $newPostContent.val().trim(),
      header: $newPostTitle.val().trim()
    };
    console.log(newPost);
    if (userInformation === null) {
      console.log("you ain't logged in dawg");
    } else {
      API.submitPost(newPost, "/api/posts").then(function(data) {
        console.log(data);
      });
    }
  };

  // Add event listeners to the submit and delete buttons
  $submitBtn.on("click", handleFormSubmit);
  $exampleList.on("click", ".delete", handleDeleteBtnClick);
  $newUserSubmit.on("click", createNewUser);
  $userLogInButton.on("click", userLogIn);
  $signOutButton.on("click", userLogOut);
  $newPostButton.on("click", newPostModal);
  $submitNewPost.on("click", submitNewPost);
});
