dfx canister call icplaunchpad_backend  create_user_account '(
   record {
     name = "John Doe";
     username = "johnn";
      profile_picture = null;  
     links = vec { "https://twitter.com/johndoe"; "https://github.com/johndoe" };
     tag = "developer";
  }
 )'