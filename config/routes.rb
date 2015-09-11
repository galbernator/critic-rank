Rails.application.routes.draw do

   root 'welcome#index'

   get "/popupclose" => "welcome#popupclose"

   resources :users
   resources :friends

end
