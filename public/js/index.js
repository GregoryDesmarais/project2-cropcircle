/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
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
  const $accordion = $("#accordion");
  const $accountInfoBtn = $("#accountInfo");
  const $newCommentButton = $("#newCommentBtn");
  const $newCommentContent = $("#newCommentContent");
  const $newCommentSubmit = $("#submitNewCommentBtn");
  const $favoriteCategoryBtn = $("#favoriteThisCategory");
  const categoryValue = $favoriteCategoryBtn.data("category");
  let userInformation = JSON.parse(sessionStorage.getItem("cornHubUser"));
  console.log(userInformation);
  let userJWT;
  let category;

  String.prototype.capitalize = () => {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  const initialize = () => {
    if (userInformation !== null) {
      userJWT = userInformation.data[1];
      $(".accountInfo").html(userInformation.data[0].userName);
      $("#signIn").hide();
      $("#signUp").hide();
      $("#accountInfo").show();
      $("#signOut").show();
      populateNavBar();
      if (userInformation.data[0].favorites.includes(categoryValue)) {
        $favoriteCategoryBtn.attr("data-favorited", true).css({ "background-color" : "#0d7787", "border" : "1px #0d7787 solid", "color" : "#56D376" }).html("Unfollow");
      } else {
        $favoriteCategoryBtn.attr("data-favorited", false).css({ "background-color" : "#56D376", "border" : "1px #56D376 solid", "color" : "#0c6573" }).html("Follow");    
      } 
    } else {
      $("#signIn").show();
      $("#signUp").show();
      $("#accountInfo").hide();
      $("#signOut").hide();
    }
  };

  const populateNavBar = () => {
    let navBarFavorites = "";
    const favorites = userInformation.data[0].favorites.sort();
    favorites.forEach(favorite => {
      navBarFavorites += `<a class="dropdown-item" href="/${favorite}"><p class="d-inline dropdownLabel">${favorite.capitalize()}</p></a>`;
    });
    $("#favoritesDropdown").html(navBarFavorites);
  };

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
    putRequest: function(example, targetURL) {
      return $.ajax({
        headers: {
          authorization: `Bearer ${userJWT}`,
          "Content-Type": "application/json"
        },
        url: targetURL,
        type: "PUT",
        data: JSON.stringify(example)
      });
    },
    submitPost: function(newPost, targetURL) {
      return $.ajax({
        headers: {
          authorization: `Bearer ${userJWT}`,
          "Content-Type": "application/json"
        },
        type: "POST",
        url: targetURL,
        data: JSON.stringify(newPost)
      });
    },
    getExamples: function(targetURL) {
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
  var refreshExamples = () => {
    API.getExamples().then(data => {
      var $examples = data.map(example => {
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
  var handleFormSubmit = event => {
    event.preventDefault();

    var example = {
      text: $exampleText.val().trim(),
      description: $exampleDescription.val().trim()
    };

    if (!(example.text && example.description)) {
      alert("You must enter an example text and description!");
      return;
    }

    API.saveExample(example).then(() => {
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

  const createNewUser = () => {
    const userName = $newUserName.val().trim();
    const userEmail = $newUserEmail.val().trim();
    const userPass = $newUserPass.val().trim();

    const newUser = {
      name: userName,
      email: userEmail,
      password: userPass
    };

    $(".newUserErrorMessage").hide();
    if (!(
      userName &&
                userName.length < 10 &&
                userName.length > 3 &&
                userEmail &&
                userPass
    )) {
      $(".invalidField")
        .show()
        .css({ color: "red" })
        .addClass("text-center");
    } else {
      API.postRequest(newUser, "/api/newUser").then(data => {
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

  const userLogOut = () => {
    sessionStorage.setItem("cornHubUser", null);
    location.reload();
  };

  const userLogIn = () => {
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
      initialize();
    });

  };

  const newPostModal = () => {
    if (userJWT !== undefined) {
      category = $(this).data("category");
      $("#newPostModal").modal("toggle");
    } else {
      $("#logInModal").modal("toggle");
    }

  };

  const submitNewPost = () => {
    const newPost = {
      userName: userInformation.data[0].userName,
      category: category,
      corntent: $newPostContent.val().trim(),
      header: $newPostTitle.val().trim(),
      UserId: userInformation.data[0].id
    };
    console.log(newPost);
    if (userInformation === null) {
      console.log("you ain't logged in dawg");
    } else {
      API.submitPost(newPost, "/api/posts").then(function(data) {
        if (data.postMade) {
          location.reload();
        }
      });
    }
  };

  const getUserInformation = userToBeQueried => {
    console.log(userToBeQueried);
    API.getExamples(`/api/user/${userToBeQueried}`).then(data => {
      let userInfoTime = `<li class="list-group-item" id="getInfoUserTime">User Since ${moment(data.memberSince).format("MMM Do YY")}</li>`;
      let userInfoPostsMade = `<li class="list-group-item" id="getInfoUserPostsMade">Number of Posts made: ${data.postsMade}</li>`;
      let userInfoCommentsMade = `<li class="list-group-item" id="getInfoUserCommentsMade">Number of Comments made: ${data.commentsMade}</li>`;
      let viewAllPosts = `<li class="list-group-item" id="viewAllP"><a href='/user/${data.userName}/posts'>View all Posts</a></li>`;
      let viewAllComments = `<li class="list-group-item" id="viewAllC"><a href='/user/${data.userName}/comments'>View all Comments</a></li>`;
      console.log(data);
      $("#getInfoUserName").html(`${data.userName}`);
      $("#userInfoList").html(`${userInfoPostsMade}${viewAllPosts}${userInfoCommentsMade}${viewAllComments}${userInfoTime}`);
      $("#userInfoModal").modal("toggle");
    });
  };

  const newCommentModal = () => {
    post = $(this).data("post");
    $("#newCommentModal").modal("toggle");
  };

  const submitNewComment = () => {
    const newComment = {
      post: $("#newCommentBtn").data("post"),
      userName: userInformation.data[0].userName,
      corntent: $newCommentContent.val().trim(),
      UserId: userInformation.data[0].id,
      category: $("#newCommentBtn").data("category"),
    };
    console.log(newComment);
    if (userInformation === null) {
      console.log("you ain't logged in dawg");
    } else {
      API.submitPost(newComment, "/api/comment").then(function(data) {
        if (data.postMade) {
          location.reload();
        }
      });
    }
  };

  const addNewFavorite = () => {   
    if (userJWT !== undefined) {
      const user = userInformation.data[0];
      const unfavoritedItem = user.favorites.indexOf(categoryValue);
      if (user.favorites.includes(categoryValue)) {
        console.log("splice running");
        userInformation.data[0].favorites.splice(unfavoritedItem, 1);
        sessionStorage.setItem("cornHubUser", JSON.stringify(userInformation));
        $favoriteCategoryBtn.attr("data-favorited", false).css({ "background-color" : "#56D376", "border" : "1px #56D376 solid", "color" : "#0c6573" }).html("Follow");
        populateNavBar();
        console.log(user.favorites);
        console.log(userInformation.data[0].favorites);
      } else {
        console.log("push running");
        userInformation.data[0].favorites.push(categoryValue);
        sessionStorage.setItem("cornHubUser", JSON.stringify(userInformation));
        console.log(userInformation.data[0].favorites);
        $favoriteCategoryBtn.attr("data-favorited", true).css({ "background-color" : "#0d7787", "border" : "1px #0d7787 solid", "color" : "#56D376" }).html("Unfollow");
        populateNavBar();
      }
      const updateFavorite = {
        UserId: user.id,
        newFavorites: user.favorites.join(",")
      };
      
      API.putRequest(updateFavorite, "/api/updateFavorites").then(data => {
        console.log(data);
      });
    } else {
      $("#logInModal").modal("toggle");
    }
  };

  // Add event listeners to the submit and delete buttons
  $submitBtn.on("click", handleFormSubmit);
  $exampleList.on("click", ".delete", handleDeleteBtnClick);
  $newUserSubmit.on("click", createNewUser);
  $userLogInButton.on("click", userLogIn);
  $signOutButton.on("click", userLogOut);
  $newPostButton.on("click", newPostModal);
  $newCommentButton.on("click", newCommentModal);
  $newCommentSubmit.on("click", submitNewComment);
  $submitNewPost.on("click", submitNewPost);
  $favoriteCategoryBtn.on("click", addNewFavorite);
  $accountInfoBtn.on("click", () => {
    getUserInformation(userInformation.data[0].id);
  });

  $(".main-sub-btn").on("click", (searchParam) => {
    event.preventDefault();

    var searchParam = $("#searchBar").val().trim();

    console.log(searchParam);

    // $.ajax({
    //   url: "http://localhost:3000/api/" + searchParam,
    //   method: "GET"
    // }).then((res) => {
    //   console.log(res);
    // });


    $(".cat-name").text("c/" + searchParam);

    var host = window.location.hostname;
    var port = window.location.port;

    if (host === "localhost") {
      window.location.href = "http://" + host + ":" + port + "/" + searchParam;
    } else {
      window.location.href = "https://" + host + "/" + searchParam;
    }

  });

  $accordion.on("click", ".getUserInfo", event => {
    event.preventDefault();
    console.log(event.target.name);
    const paramId = event.target.name;
    getUserInformation(paramId);
  });

  initialize();

  $("#tos").click(function() {
    if (!localStorage.acceptTerms) {
      localStorage.acceptTerms = true;
    }
    if ($("footer").hasClass("footer-hide")) {
      $("footer").removeClass("footer-hide");
    } else {
      $("footer").addClass("footer-hide");
    }
  });

  if (localStorage.acceptTerms) {
    $("footer").addClass("footer-hide");
  }
});