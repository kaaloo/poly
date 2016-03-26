class BooksController < ApplicationController
  def show
    @book = Book.find(params[:id])
    @phrase_pairs = @book.phrase_pairs
  end

  def create
    if book = Book.create(create_params)
      render json: { id: book.id }, status: :ok
    else
      render json: { errors: book.errors.messages }, status: 422
    end
  end

  private

  def create_params
    params.require(:book).permit(
      :title,
      :description,
      :source_language,
      :target_language
    )
  end
end
