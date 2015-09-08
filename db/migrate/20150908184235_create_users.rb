class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :facebook_id
      t.string :name
      t.string :facebook_picture
      t.string :facebook_url

      t.timestamps null: false
    end
  end
end
