class CreateFriends < ActiveRecord::Migration
  def change
    create_table :friends do |t|
      t.string :facebook_id
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
