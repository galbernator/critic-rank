class FriendsController < ApplicationController

  def index
    render json: Friend.all
  end

  def create
    Friend.create!(facebook_id: params[:facebook_id], user: User.find(params[:user_id]))
    head :created
  end

end
