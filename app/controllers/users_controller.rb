class UsersController < ApplicationController
  def create
    User.create!(facebook_id: params[:facebook_id], name: params[:name], facebook_picture: params[:facebook_picture], facebook_url: params[:facebook_url])
    head :created
  end

end
