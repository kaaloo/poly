class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.references :favorited, polymorphic: true, index: true
      t.references :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end
