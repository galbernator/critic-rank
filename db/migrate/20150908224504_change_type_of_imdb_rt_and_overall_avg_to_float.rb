class ChangeTypeOfImdbRtAndOverallAvgToFloat < ActiveRecord::Migration
  def change
    change_column :users, :imdb_avg, :float
    change_column :users, :rt_avg, :float
    change_column :users, :overall_avg, :float
  end
end
