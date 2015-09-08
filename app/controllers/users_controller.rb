class UsersController < ApplicationController
  def create
    User.create!(facebook_id: params[:facebook_id], name: params[:name], facebook_picture: params[:facebook_picture], facebook_url: params[:facebook_url], imdb_avg: params[:imdb_avg], rt_avg: params[:rt_avg], overall_avg: params[:overall_avg])
    head :created
  end

end
