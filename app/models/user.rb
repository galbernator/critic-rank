class User < ActiveRecord::Base

  validates :facebook_id, presence: true, uniqueness: true
  validates :name, presence: true
  validates :facebook_url, presence: true, uniqueness: true
end
