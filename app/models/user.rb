class User < ActiveRecord::Base

  has_many :friends, dependent: :nullify

  validates :facebook_id, presence: true, uniqueness: true
  validates :name, presence: true
  validates :facebook_url, presence: true, uniqueness: true
end
