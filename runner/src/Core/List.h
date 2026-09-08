namespace Core
{

  template <typename T>
  class ListIterator
  {
  public:
    ListIterator(T *data, unsigned int length, unsigned int index);
    ListIterator<T> operator++();
    bool operator!=(const ListIterator<T> &other);
    const T &operator*() const;

  private:
    T *data;
    unsigned int length;
    unsigned int index;
  };

  template <typename T>
  class List
  {
  public:
    List();

    void push(T input);
    unsigned int &get_length() const;
    T get_item(unsigned int &index) const;

    ListIterator<T> begin() const;
    ListIterator<T> end() const;

  private:
    T *data;
    unsigned int length;
    unsigned int mem_length;
  };
}