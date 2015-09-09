class Friend < ActiveRecord::Base
  belongs_to :user
  
  validates_uniqueness_of :user_id, :scope => [:facebook_id]
end
