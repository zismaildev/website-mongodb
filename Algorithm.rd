!!! hash Url

## User {
    register {
        check 
            username 
            password 
            comfirm password
            and save to database
            } *
    login {
        check username password 
    }
    authen {
        check token jwt 
        respon username email Fullname lastname
    }
    forgot password {
        sent link resetpassword email or phonenumber
    }
    comfirm email phonenumber {

    }
    role admin 
    membershoip User
}

Appbar show{
    logo
    home 
    product
    about us
    username 
    avatar 
    or pleaselogin
}

Footer {
    icon contact
    Copyright
}

## Page
Home {
    carousel
    card show promotion
    show new product
    show new update
}

product {
    card show product{
        img 
        title
        content
        price
    }
    check buy {
        if buy show owned and button download
        else show price
    }
}

dashboard user {
    seting change {
        email 
        avatar
        Fullname 
        lastname 
        phonenumber 
        change ip
    }
    show owned product {
        show download
        show version
    }
}

dashboard admin {
    check role admin {
        if role === admin show dashboard
        else don't show
    }
    show view product
    upload product 
    delete product
}