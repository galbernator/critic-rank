class AddImdbRtAndOverallAverageToUser < ActiveRecord::Migration
  def change
    add_column :users, :imdb_avg, :int
    add_column :users, :rt_avg, :int
    add_column :users, :overall_avg, :int
  end
end
