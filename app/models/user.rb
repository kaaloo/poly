class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :books
  has_many :favorites
  has_many :favorite_books, through: :favorites, source: :favorited, source_type: 'Book'
end
