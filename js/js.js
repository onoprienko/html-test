
  Module = (function ($) {
    //set options and class names
    // todo: settings получаем из файла с настройками 
    const settings = 
    {
      have_phone_field : 0, //from back 
      email_validate_handler_url : 'validate.php',
      email_prise_handler_url:'prise.php',
    }
    
    const selectors = 
    {
     
      inputs:
      {
          email : "some_class_email",
          phone : "some_class_phone", //or null 
      },
      buttons:
      {
        spin_btn:'spin_class'
      },
      tech_output:
      {
        errors:
        {
          error_mail_validation:'mail_error_field',
          error_ajax_get_prise:'',
          error_ajax_get_won_spin:'',
          error_ajax_get_emails:'',
        }
      },
      roulette:
      {
          spinning_bg:'spinning_img_class',
          prise_field:'prise_field'
      }
      

    }
    function get_elem(elem){
          if($('.'+elem).length===0){
            return false;
          }
          return $('.'+elem);
    }
    
    // set output texts
    const texts = 
    {
      _errors:
        {
          ajax:{
            error_ajax_get_prise:'Error getting prises',
            error_ajax_get_won_spin:'Error getting won spin',
            error_ajax_get_emails:'Error getting emails base', 
          },
          email:
          {
            error_mail_validation:'email already used',//from back error type
          },
          js:
          {
            error_spin_count:'Current spin number is higher than spin count',
          }
        }
      
    }

    let validation = undefined;
    let prise=undefined;
    function translate(text,lang){
      
      //get translation
      return text;
    }
    let email =
    {
      validate:function(elem_class,error_field_class,lang=navigator.language){
        let output;
        let value = $('.'+elem_class).val();
        $.ajax({
            url:settings.email_validate_handler_url,
            type:"POST",
            async:false,
            data: {
                email: value,
            },
            success:function(data){
              let data_arr = JSON.parse(data)
              output = data_arr.valid  
                
            },
            error:function(data){
              $('.'+error_field_class).html(translate(data,lang));
              output = {error:data};
            }
        });
        return output;
      },
      get_prise:function(elem_class,error_field_class,lang=navigator.language,has_phone){
        
        let mail_value = $('.'+elem_class[0]).val();
        let phone_value = $('.'+elem_class[1]).val();
        let send_data = {
                email:mail_value,
                
            }
        if (have_phone_field){
            data.phone=phone_value;
        }
        $.ajax({
            url:settings.email_validate_handler_url,
            type:"POST",
            async:false,
            data: send_data,
            success:function(get_data){
                let data_arr = JSON.parse(get_data)
                output =  {'prise':data_arr.prise ,'winnum' : data_arr.winnum};
            },
            error:function(data){
              $('.'+error_field_class).html(translate(data,lang));
              output =  {error:data};
            }
        });
        return output;
      }
    }
    let roulette = {
      spin:function(winnum,prise){
        // u have some prise responses (usually they are 1,2,3 etc.) so u have 2 compare them with your roulette field. 
        //Prise response "0" means either u have an error (if roullete dont have blank spins) or u just have a blank spin
        
        
        //here u have 2 add spin animation (compare prise output with your prises and just rotate your roulette image (if its a standart build))
        console.log(' //spin animation');

        if(winnum===0){
          $('.'+selectors.roulette.prise_field).html(prise)
        }
      }
    };
    let pub = {
        init: function () {
          if (
            // comment lines u dont want 2 check
            get_elem(selectors.inputs.email) && 
            get_elem(selectors.roulette.spinning_bg) &&
            get_elem(selectors.roulette.prise_field) &&
            get_elem(selectors.tech_output.errors.error_mail_validation) &&
            get_elem(selectors.buttons.spin_btn) 
          ) {
            _initial_click();
            
          }else{
            console.log('error getting input/output fields');
          }  
        },
    };
    function _initial_click() {
      $('.'+selectors.buttons.spin_btn).click(function(e){
        e.preventDefault();
        
        if(validation===undefined || !validation ){ // case not set
          validation = email.validate(selectors.inputs.email, selectors.tech_output.errors.error_mail_validation);
        }
        if(validation!==true && validation && validation.error){ // error output
          console.log('validation error message = '+validation.error.responseJSON.message+', code = '+validation.error.responseJSON.code)
          return false;
        }
        if(prise===undefined || !prise){ // case not set
          prise = email.get_prise([selectors.inputs.email,selectors.inputs.phone], selectors.tech_output.errors.error_mail_validation,false);
        }
        if(prise){
          if(prise.winnum > 0){
            prise.winnum--;
            roulette.spin(prise.winnum,prise.prise);
          }
        }  
      })
    }
    
    return pub;
})(jQuery);
window.addEventListener("DOMContentLoaded",function(){
  Module.init();
})

